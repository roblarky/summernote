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
        'save': function (context) {
            var self = this,
                modalElement,
                context = context,
                ui = $.summernote.ui,
                options = context.options,
                $editor = context.layoutInfo.editor,
                $editable = context.layoutInfo.editable;

            context.memo('button.save', function () {
                var button = ui.button({
                    contents: '<i class="fa fa-save"/> Save',
                    title: 'Save',
                    container: false,
                    tooltip: 'Save Changes',
                    click: function () {
                        //alert('POST save changes here');
                        //TODO: (CMS) Update page contents? console.log(context.code());
                        //console.log(context.$note.summernote('code'));
                        console.log(context.code());
                        //context.$note.summernote('destroy');
                        context.destroy();
                        $('.tooltip').tooltip('hide');
                        editorDirty = false;
                    }
                });

                return button.render();
            });
        }
    });
}));