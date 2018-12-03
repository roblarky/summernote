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
        'save': function(context){
            var self = this,
                modalElement,
                ui = $.summernote.ui;

                context.memo('button.save', function () {
                    var button = ui.button({
						contents: '<i class="fa fa-save"/> Save',
						title: 'Save',
						container: false,
						tooltip: 'Save Changes',
						click: function () {
							//context.invoke('editor.destroy');
							$('.tooltip').tooltip('hide');
							//alert('POST save changes here');
							//TODO: (CMS) Update page contents?
							//console.log(context.code());
							console.log($('#summernote').summernote('code'));
							//context.destroy(); //TODO why is context undefined here?
							//$('#summernote').html($('#summernote').summernote('code'));
							$('#summernote').summernote('destroy');
							editorDirty = false;
						}
                        });
    
                    return button.render();
                });    
        }
    });
}));