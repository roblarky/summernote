/*(function (factory) {
    
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

    return {
        cancel: summernoteCancelButton,
        save: summernoteSaveButton,
        video: summernoteVideoButton,
        image: summernoteImageButton
    }
*/

    var summernoteCancelButton = function (context) {
        var ui = $.summernote.ui;
        var button = ui.button({
            contents: '<i class="fas fa-times"/> Cancel',
            title: 'Cancel',
            container: false,
            tooltip: 'Cancel edit',
            click: function () {
                //context.invoke('editor.destroy');
                $('.tooltip').tooltip('hide');
                context.destroy();
            }
        });

        return button.render();
    }

    var summernoteSaveButton = function (context) {
        var ui = $.summernote.ui;
        var button = ui.button({
            contents: '<i class="fas fa-save"/> Save',
            title: 'Save',
            container: false,
            tooltip: 'Save Changes',
            click: function () {
                //context.invoke('editor.destroy');
                $('.tooltip').tooltip('hide');
                alert('POST save changes here');
                //TODO: (CMS) Update page contents?
                console.log(context.code());
                context.destroy();
            }
        });

        return button.render();
    }
    /*
    function summernoteImageButton (context) {
        var ui = $.summernote.ui;
        var button = ui.button({
            contents: '<i class="fas fa-image"/> Image',
            title: 'Image',
            container: false,
            tooltip: 'Image',
            click: function () {
                //context.invoke('editor.destroy');
                $('.tooltip').tooltip('hide');
                alert('Show image library modal here');
                //TODO: (CMS) Update page contents?
                $("#caImageBrowser").modal('show');
                //context.destroy();
            }
        });

        return button.render();
    }

    function summernoteVideoButton (context) {
        var ui = $.summernote.ui;
        var button = ui.button({
            contents: '<i class="fas fa-video"/> Video',
            title: 'Video',
            container: false,
            tooltip: 'Video',
            click: function () {
                //context.invoke('editor.destroy');
                $('.tooltip').tooltip('hide');
                alert('Show Video modal here');
                //TODO: (CMS) Update page contents?
                //context.destroy();
            }
        });

        return button.render();
    }
    */
//}));
