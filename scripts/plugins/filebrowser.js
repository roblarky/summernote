﻿(function (factory) {
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

        "filebrowser": function(context){
            var self = this,
                modalElement,
                ui = $.summernote.ui;

            context.memo('button.filebrowser', function () {
                var button = ui.button({
                    contents: '<i class="fa fa-file"/> File',
                    title: 'File',
                    container: false,
                    tooltip: 'File Browser',
                    click: function () {
                        activeEditorContext = context;
                        context.invoke('saveRange');
                        if (!modalElement) {
                            modalElement = $('<div>').addClass("modal fade")
                                .append($("<div>").addClass("modal-dialog modal-lg")
                                    .append($("<div>").addClass("modal-content")));
                            modalElement
                                .attr({
                                    id: 'summernoteModal',
                                    tabindex: "-1",
                                    role: "dialog",
                                    'aria-hidden': true
                                });
                            modalElement.appendTo('body');
                        }
                        $.get("/Admin/ContentEditor/_FileBrowserModalContent", function (data) {
                            $(".modal-content", modalElement).html(data);
                            modalElement.off("shown.bs.modal");
                            modalElement.on("shown.bs.modal", function () {
                                console.log("File Browser: shown.bs.modal");
                                $(document).trigger("editor.browser.ready");
                            });
                            modalElement.modal('show');
                        });
                    }
                });

                var $filebrowser = button.render();
                return $filebrowser;
            });
        },

    });
}));