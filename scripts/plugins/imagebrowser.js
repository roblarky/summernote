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

        'imagebrowser': function(context){
            var self = this,
                modalElement,
                ui = $.summernote.ui;
            if (!modalElement) {
                modalElement = $('<div>').addClass("modal fade")
                    .append($("<div>").addClass("modal-dialog modal-lg")
                        .append($("<div>").addClass("modal-content")));
                modalElement
                    .attr({
                        id: 'summernoteImageBrowserModal',
                        tabindex: "-1",
                        role: "dialog",
                        'aria-hidden': true
                    })
                    .css('z-index', "1100");
                modalElement.appendTo('body');
            }                
            context.memo('button.imagebrowser', function () {
                var button = ui.button({
                    contents: '<i class="fa fa-image"/> Image',
                    title: 'Image',
                    container: false,
                    tooltip: 'Image Browser',
                    click: function () {
                        activeEditorContext = context;
                        context.invoke('saveRange');
                        $.get("/Admin/ContentEditor/_ImageBrowserModalContent", function (data) {
                            $(".modal-content", modalElement).html(data);
                            modalElement.off("shown.bs.modal");
                            modalElement.on("shown.bs.modal", function () {
                                console.log("Image Browser: shown.bs.modal");
                                $(document).trigger("editor.imagebrowser.ready");
                            });
                            modalElement.modal('show');
                        });
                    }
                });

                var $imagebrowser = button.render();
                return $imagebrowser;
            });    
        },


    });
}));