
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
  } (function ($) {
    
    $.extend( $.summernote.plugins, {

        'accordion': function (context) {
            var self = this
                ui = $.summernote.ui,
                options = context.options,
                $editor   = context.layoutInfo.editor,
                $editable = context.layoutInfo.editable;
                editable = $editable[0];
      
            // add accordion button
            context.memo('button.accordion', function () {
              // create button
              var button = ui.button({
                contents: '<i class="glyphicon glyphicon-menu-hamburger"/> Accordion',
                container: false,
                tooltip: "Accordion",
                click: function () {
                  self.show();
                }
              });
        
              // create jQuery object from button instance.
              var $accordion = button.render();
              return $accordion;
            });
        
            this.showAccordionOptions = function(){
              const rng = context.invoke('createRange', $editable),
                    nodes = rng.nodes();
              if(self.isInAccordion(nodes) && self.isOnButton(nodes)){
                  //Do something just for accordions
                  console.log('is Accordion');
              } else {
                  return false;
              }
          };
      
          this.isOnButton = (nodes) => $(nodes).parents("button").length;
          this.isInAccordion = (nodes) => $(nodes).parents(".accordion").length;
      
            // This events will be attached when editor is initialized.
            this.events = {
              // This will be called after modules are initialized.
              'summernote.init': function (we, e) {
                console.log('summernote initialized', we, e);
              },
              // This will be called when user releases a key on editable.
              'summernote.keyup, summernote.mouseup': function (we, e) {
                  self.showAccordionOptions();
              }
            };
        
            // This method will be called when editor is initialized by $('..').summernote();
            // You can create elements for plugin
            this.initialize = function () {
              var $container = options.dialogsInBody ? $(document.body) : context.layoutInfo.editor,
                  body = '<button href="#" class="btn btn-primary" id="add-accordion">Add Accordion</button>',
                  footer = '<button href="#" class="btn btn-primary" id="insert-accordion">Insert Accordion</button>',
                  accordionInput =
                          '<div class="card">' +
                          '<div class="card-body">' +
                          '<i class="fa fa-close pull-right" aria-hidden="true"></i>' +
                          '<div class="form-group">' +
                              '<label>Accordion Title</label>' +
                              '<input class="form-control" type="text" />' +
                          '</div>' +
                          '<div class="form-group">' +
                              '<label>Accordion Content</label>' +
                              '<textarea class="form-control" rows="4" />' +
                          '</div>' +
                          '</div>' +
                          '</div>';
      
              //Create dialog
              this.$dialog = ui
                  .dialog({
                      title: "Insert Accordion",
                      fade: options.dialogsFade,
                      body: body,
                      footer: footer
                  })
                  .render()
                  .appendTo($container);
      
              //Create logic for Add button and Delete button
              var $addBtn = self.$dialog.find('#add-accordion')
                  .click(function (event) {
                      event.preventDefault();
                      $addBtn.before(accordionInput);
                      var $deleteBtn = self.$dialog.find('.fa-close')
                          .click(function (event) {
                              event.preventDefault();
                              event.currentTarget.parentNode.parentNode.remove();
                          });
                      });
            };
        
            this.show = function () {
              context.invoke('editor.saveRange');
              this.showAccordionDialog().then(function (data) {
                // [workaround] hide dialog before restore range for IE range focus
                ui.hideDialog(self.$dialog);
                context.invoke('editor.restoreRange');
      
                //Create accordion
                if (data.length > 0) {
                  var accordionId = "accordion" + new Date().getTime();
                  var toInsert = '<div class="panel-group" id="' + accordionId + '">';
                  for (var i = 0; i < data.length; i++) {
                    var myId = accordionId + (i + 1);
                    toInsert += '<div class="card">';
                    toInsert += '<div class="card-header">';
                    toInsert += '<h4 class="panel-title">';
                    toInsert += '<button data-toggle="collapse" data-parent="#' + accordionId + '" href="#' + myId + '">' + data[i].title + '</button>';
                    toInsert += '</h4>';
                    toInsert += '</div>';
                    toInsert += '<div id="' + myId + '" class="panel-collapse collapse in">';
                    toInsert += '<div class="card-body">';
                    toInsert += '<p>' + data[i].content + '</p>';
                    toInsert += '</div>';
                    toInsert += '</div>';
                    toInsert += '</div>';
                  }
                  toInsert += '</div>';
                  var div = document.createElement('div');
                  div.innerHTML = toInsert;
                  context.invoke('editor.insertNode', div);
                }
              }).fail(function () {
                context.invoke('editor.restoreRange');
              });
            };
        
            this.showAccordionDialog = function () {
              return $.Deferred(function (deferred) {
                ui.onDialogShown(self.$dialog, function () {
                  //Add resolve to insert button
                  var $insertBtn = self.$dialog.find('#insert-accordion');
                  context.triggerEvent('dialog.shown');
                  $insertBtn.click(function (event) {
                    event.preventDefault();
                    // Get user data
                    var data = [];
                    var $formInput = self.$dialog.find('.form-control');
                    for (var i = 0; i < $formInput.length; i = i + 2) {
                      data.push({
                        title: $formInput[i].value,
                        content: $formInput[i + 1].value
                      });
                    }
                    deferred.resolve(data);
                  });
                });
        
                ui.onDialogHidden(self.$dialog, function () {
                  // Remove panel
                  var $accordionPanel = self.$dialog.find('.panel');
                  for (var i = 0; i < $accordionPanel.length; i++) {
                    $accordionPanel[i].remove();
                  }
                });
        
                ui.showDialog(self.$dialog);
              });
            };
      
            // This methods will be called when editor is destroyed by $('..').summernote('destroy');
            // You should remove elements on `initialize`.
            this.destroy = function () {
              this.$dialog.remove();
              this.$dialog = null;
            };
        }
    });
  }));