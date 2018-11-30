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
        "tabs": function(context){
            var self = this,
            modalElement,
            ui = $.summernote.ui;

            
            this.events = {
                // This will be called after modules are initialized.
                'summernote.init': function (we, e) {
                  console.log('summernote initialized', we, e);
                },
                // This will be called when user releases a key on editable.
                'summernote.keyup, summernote.mouseup': function (we, e) {
                    this.update();
                }
              };
          
  
            this.initialize = function(){
                // We should add some additional UI markup to these elements to indicate what they are/do
            }

            this.update = function (){
                const rng = context.invoke('createRange', $editable),
                nodes = rng.nodes();
                if(rng.isCollapsed() && rng.isOnAnchor() && self.isInTabs(nodes)){
                    //Do something just for tabs
                    console.log('is tabs');
                } else {
                    return false;
                }

            };

            this.addTabs = function(){
                console.log("something here!!!");
            }

            this.isInTabs = (nodes) => $(nodes).parents(".tabs-block").length;

        }
    });
}));