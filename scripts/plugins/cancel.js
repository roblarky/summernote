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
        'cancel': function(context){
            var self = this,
                modalElement,
                ui = $.summernote.ui;

                context.memo('button.cancel', function () {
                    var button = ui.button({
					contents: '<i class="fa fa-times"/> Cancel',
					title: 'Cancel',
					container: false,
					tooltip: 'Cancel edit',
					click: function () {
						if(editorDirty) {
							if(!confirm('Are you sure you want to cancel and lose any changes?')) return;
						}
						//context.invoke('editor.destroy');
						$('#summernote').find("[id]").each(function() {
							this.id = this.id.replace('SUMMERNOTETEMPIDAPPEND','');
						})
						$('.tooltip').tooltip('hide');
						//context.invoke('editor.destroy'); //TODO why is context undefined here?
						$('#summernote').summernote('reset');
						$('#summernote').summernote('destroy');
						editorDirty = false;
					}
                        });
    
                    return button.render();
                });    
        }
    });
}));