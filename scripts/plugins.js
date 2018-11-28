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

        'modal': function (context) {
            var self = this,
                modalElement,
                ui = $.summernote.ui;

            context.memo('button.youtubebrowser', function () {
                var button = ui.button({
                        contents: '<i class="fa fa-video"/> Video',
                        title: 'Video',
                        container: false,
                        tooltip: 'Video Browser',
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

            context.memo('button.imagebrowser', function () {
                var button = ui.button({
                    contents: '<i class="fa fa-image"/> Image',
                    title: 'Image',
                    container: false,
                    tooltip: 'Image Browser',
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

            this.initialize = function () {
                              
            };

            this.destroy = function () {
                
            };
        }
    });
}));