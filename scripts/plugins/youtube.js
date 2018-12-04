(function (factory) {
    /* global define */
    if (typeof define === 'function' && define.amd) {
        // AMD. Register as an anonymous module.
        define(['jquery'], factory);
    } else if (typeof module === 'object' && module.exports) {
        // Node/CommonJS
        module.exports = factory(require('jquery'));
    } else {
        // Browser globals
        factory(window.jQuery);
    }
}(function ($) {
    $.extend($.summernote.plugins, {
        'youtube': function (context) {
            var self = this,
                modalElement,
                ui = $.summernote.ui;
            if (!modalElement) {
                modalElement = $('<div>')
                    .addClass("modal fade")
                    .append($("<div>").addClass("modal-dialog modal-lg").append($("<div>").addClass("modal-content")));
                modalElement.attr({id: 'summernoteYouTubeBrowserModal', tabindex: "-1", role: "dialog", 'aria-hidden': true, 'z-index': "1100"});
                modalElement.appendTo('body');
            }
            context.memo('button.youtubebrowser', function () {
                var button = ui.button({
                    contents: '<i class="fa fa-tv"/> Video',
                    title: 'Video',
                    container: false,
                    tooltip: 'Video Browser',
                    click: function () {
                        activeEditorContext = context;
                        context.invoke('saveRange');
                        $.get("/Admin/ContentEditor/_YouTubeBrowserModalContent", function (data) {
                            $(".modal-content", modalElement).html(data);
                            modalElement.off("shown.bs.modal");
                            modalElement.on("shown.bs.modal", function () {
                                console.log("YouTube Browser: shown.bs.modal");
                                $(document).trigger("editor.youtubebrowser.ready");
                            });
                            modalElement.modal('show');
                        });
                    }
                });

                var $youtubebrowser = button.render();
                return $youtubebrowser;
            });
        }
    });
}));