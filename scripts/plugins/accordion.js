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

        'accordion': function (context) {
            var self = this
                rng = null,
                nodes = null,
                ui = $.summernote.ui,
                context = context,
                options = context.options,
                $editor = context.layoutInfo.editor,
                $editable = context.layoutInfo.editable,
                editable = $editable[0];

                // add accordion button
                context.memo('button.accordionDialog', function () {
                    // create button
                    var button = ui.button({
                        contents: '<i class="fa fa-bars"/> Accordion',
                        container: false,
                        tooltip: "Insert a new accordion set",
                        click: function () {
                            self.showDialog();
                        }
                    });

                    // create jQuery object from button instance.
                    return button.render();
                });

                context.memo('button.addaccordion', function () {
                    // create button
                    var button = ui.button({
                        contents: '<i class="fa fa-plus"/>',
                        container: false,
                        tooltip: "Insert new section below",
                        click: function () {
                            self.addSection();
                            self.hide();
                        }
                    });
                    return button.render();
                });

                context.memo('button.removeaccordion', function () {
                    // create button
                    var button = ui.button({
                        contents: '<i class="fa fa-trash"/>',
                        container: false,
                        tooltip: "Delete section",
                        click: function () {
                            if (confirm('Are you sure you want to remove this section?')) {
                                self.removeSection();
                                self.hide();
                            }
                        }
                    });
                    return button.render();
                });

                context.memo('button.accordionup', function () {
                    // create button
                    var button = ui.button({
                        contents: '<i class="fa fa-chevron-up"/>',
                        container: false,
                        tooltip: "Move section up",
                        click: function () {
                            self.moveSectionUp();
                        }
                    });
                    return button.render();
                });

                context.memo('button.accordiondown', function () {
                    // create button
                    var button = ui.button({
                        contents: '<i class="fa fa-chevron-down"/>',
                        container: false,
                        tooltip: "Move section down",
                        click: function () {
                            self.moveSectionDown();
                        }
                    });
                    return button.render();
                });

                context.memo('button.accordionhidepopover', function () {
                    // create button
                    var button = ui.button({
                        contents: '<i class="fa fa-times"/>',
                        container: false,
                        tooltip: "Hide Popup",
                        click: function () {
                            self.hide();
                        }
                    });
                    return button.render();
                });

                // This events will be attached when editor is initialized.
                this.events = {
                    // This will be called after modules are initialized.
                    'summernote.init': function (we, e) {
                        //console.log('summernote initialized', we, e);
                    },
                    // This will be called when user releases a key on editable.
                    'summernote.keyup, summernote.mouseup': function (we, e) {
                        self.update();
                    },
                    'summernote.disable summernote.dialog.shown': () => {
                        this.hide();
                    }
                };

                // This method will be called when editor is initialized by
                // $('..').summernote(); You can create elements for plugin
                this.initialize = function () {
                    var $container = options.dialogsInBody
                            ? $(document.body)
                            : context.layoutInfo.editor,
                        body = '<button href="#" class="btn btn-primary" id="add-accordion">Add Accordion</butto' +
                                'n>',
                        footer = '<button href="#" class="btn btn-primary" id="insert-accordion">Insert Accordion<' +
                                '/button>',
                        accordionInput = '<div class="card"><div class="card-body"><i class="fa fa-close pull-right" aria-' +
                                'hidden="true"></i><div class="form-group"><label>Accordion Title</label><input c' +
                                'lass="form-control" type="text" /></div><div class="form-group"><label>Accordion' +
                                ' Content</label><textarea class="form-control" rows="4" /></div></div></div>';

                    //Create dialog
                    this.$dialog = ui
                        .dialogLarge({title: "Insert Accordion", fade: options.dialogsFade, body: body, footer: footer})
                        .render()
                        .appendTo($container);

                    //Create logic for Add button and Delete button
                    var $addBtn = self
                        .$dialog
                        .find('#add-accordion')
                        .click(function (event) {
                            event.preventDefault();
                            $addBtn.before(accordionInput);
                            var $deleteBtn = self
                                .$dialog
                                .find('.fa-close')
                                .click(function (event) {
                                    event.preventDefault();
                                    event
                                        .currentTarget
                                        .parentNode
                                        .parentNode
                                        .remove();
                                });
                        });

                    // We should add some additional UI markup to these elements to indicate what
                    // they are/do
                    this.$popover = ui.popover({
                        className: 'note-accordion-popover',
                        callback: ($node) => {
                            const $content = $node.find('.popover-content,.note-popover-content');
                        }
                    })
                        .render()
                        .appendTo(options.container);
                    const $content = this
                        .$popover
                        .find('.popover-content,.note-popover-content');

                    context.invoke('buttons.build', $content, options.popover.accordion);
                };

                this.moveSectionUp = function () {
                    let currentSection = $(this.nodes[0])
                        .closest('.card')
                        .get(0);
                    let previousSection = currentSection.previousElementSibling;
                    if (previousSection) {
                        let newNode = currentSection
                            .parentNode
                            .insertBefore(currentSection, previousSection);
                        const ph = $(this.nodes[0])
                            .get(0)
                            .parentElement;
                        const pos = $(ph).offset();
                        const height = $(ph).outerHeight(true); // include margin
                        this
                            .$popover
                            .css({
                                display: 'block',
                                left: pos.left,
                                top: pos.top - height
                            });
                    }
                }

                this.moveSectionDown = function () {
                    let currentSection = $(this.nodes[0])
                        .closest('.card')
                        .get(0);
                    let nextSection = currentSection.nextElementSibling;
                    if (nextSection) {
                        let newNode = currentSection
                            .parentNode
                            .insertBefore(nextSection, currentSection);
                        const ph = $(this.nodes[0])
                            .get(0)
                            .parentElement;
                        const pos = $(ph).offset();
                        const height = $(ph).outerHeight(true); // include margin
                        this
                            .$popover
                            .css({
                                display: 'block',
                                left: pos.left,
                                top: pos.top - height
                            });
                    }
                }

                this.addSection = function () {
                    let currentSection = $(this.nodes[0])
                        .closest('.card')
                        .get(0);
                    let accordionContainer = currentSection.parentNode;
                    var newSection = document.createElement('div');
                    newSection
                        .classList
                        .add('card');
                    let newHeadingId = 'newSection' + new Date().getTime();
                    let newCollapseId = 'newCollapse' + new Date().getTime();
                    let newHTML = '<div class="card-header" id="' + newHeadingId + '">';
                    newHTML += '     <h4 class="panel-title">';
                    newHTML += '       <button class="btn btn-link" type="button" data-toggle="collapse" data-pa' +
                            'rent="#' + accordionContainer.id + '" data-target="#' + newCollapseId + '" href="#' + newCollapseId + '" aria-expanded="true" aria-controls="' + newCollapseId + '">';
                    newHTML += '         New Section';
                    newHTML += '       </button>';
                    newHTML += '     </h4>';
                    newHTML += '   </div>';
                    newHTML += '   <div id="' + newCollapseId + '" class="panel-collapse collapse in" aria-labelledby="' + newHeadingId + '" data-parent="#' + accordionContainer.id + '">';
                    newHTML += '     <div class="card-body">';
                    newHTML += '       Insert Content Here';
                    newHTML += '     </div>';
                    newHTML += '   </div>';
                    newSection.innerHTML = newHTML;
                    accordionContainer.insertBefore(newSection, currentSection.nextElementSibling);
                    $('#' + newHeadingId)
                        .find('.btn')
                        .last()
                        .trigger('click');
                }

                this.removeSection = function () {
                    //Current tab
                    let currentSection = $(this.nodes[0])
                        .closest('.card')
                        .get(0);
                    let accordionContainer = currentSection.parentNode;
                    let previousSection = currentSection.previousElementSibling;
                    let nextSection = currentSection.nextElementSibling;
                    currentSection.remove();
                    //if there are no other sections, remove accordion container
                    if ($(accordionContainer).find('.card').length == 0) {
                        accordionContainer.remove();
                    } else {
                        if (previousSection) {
                            $(previousSection)
                                .find('.card-header .btn')
                                .last()
                                .trigger('click');
                        } else if (nextSection) {
                            $(nextSection)
                                .find('.card-header .btn')
                                .last()
                                .trigger('click');
                        }
                    }
                }

                this.showDialog = function () {
                    context.invoke('editor.saveRange');

                    this
                        .showAccordionDialog()
                        .then(function (data) {
                            const rng = context.invoke('getLastRange');
                            let nodes = rng.nodes();
                            // [workaround] hide dialog before restore range for IE range focus
                            ui.hideDialog(self.$dialog);
                            context.invoke('editor.restoreRange');

                            //Create accordion
                            if (data.length > 0) {
                                var accordionId = "accordion" + new Date().getTime();
                                var toInsert = '<div class="accordion accordion-container" id="' + accordionId + '">';
                                for (var i = 0; i < data.length; i++) {
                                    var myId = accordionId + (i + 1);
                                    toInsert += '<div class="card">';
                                    toInsert += '<div class="card-header" id="' + myId + 'Header">';
                                    toInsert += '<h4 class="panel-title">';
                                    toInsert += '<button class="btn btn-link" data-toggle="collapse" data-parent="#' + accordionId + '" data-target="#' + myId + '" href="#' + myId + '" aria-expanded="true" aria-controls="' + myId + '">' + data[i].title + '</button>';
                                    toInsert += '</h4>';
                                    toInsert += '</div>';
                                    toInsert += '<div id="' + myId + '" class="panel-collapse collapse in" aria-labelledby="' + myId + 'Header" data-parent="#' + accordionId + '">';
                                    toInsert += '<div class="card-body">';
                                    toInsert += '<p>' + data[i].content + '</p>';
                                    toInsert += '</div>';
                                    toInsert += '</div>';
                                    toInsert += '</div>';
                                }
                                toInsert += '</div>';
                                var div = document.createElement('div');
                                div.innerHTML = toInsert;
                                if (nodes.length > 1) {
                                    alert('More than 1 node selected.');
                                } else if ($(nodes[0]).closest('.tab-pane').length || $(nodes[0]).closest('.card-body').length) {
                                    //If this is insite of a tab panel, directly insert node
                                    // TODO: Only do this for a single node..probably need to disable accordion if
                                    // more than 1 node selected
                                    nodes[0]
                                        .parentNode
                                        .insertBefore(div, nodes[0].nextElementSibling);
                                } else {
                                    // Let summernote insert the node, summernote will split/close nodes to ensure
                                    // HTML makes sense. This is good, but it does not work well inside a tab content
                                    // panel as it actually splits the tab container and inserts the node
                                    context.invoke('editor.insertNode', div);
                                }
                            }
                        })
                        .fail(function () {
                            context.invoke('editor.restoreRange');
                        });
                };

                this.showAccordionDialog = function () {
                    return $.Deferred(function (deferred) {
                        ui
                            .onDialogShown(self.$dialog, function () {
                                //Add resolve to insert button
                                var $insertBtn = self
                                    .$dialog
                                    .find('#insert-accordion');
                                context.triggerEvent('dialog.shown');
                                $insertBtn.off('click');
                                $insertBtn.click(function (event) {
                                    console.log('accordion: insertBtn.click');
                                    event.preventDefault();
                                    // Get user data
                                    var data = [];
                                    var $formInput = self
                                        .$dialog
                                        .find('.form-control');
                                    for (var i = 0; i < $formInput.length; i = i + 2) {
                                        if($formInput[i].value){
                                            data.push({
                                                title: $formInput[i].value,
                                                content: $formInput[i + 1].value
                                            });
                                        }
                                    }
                                    deferred.resolve(data);
                                });
                            });

                        ui.onDialogHidden(self.$dialog, function () {
                            // Remove panel
                            var $accordionPanel = self
                                .$dialog
                                .find('.card');
                            for (var i = 0; i < $accordionPanel.length; i++) {
                                $accordionPanel[i].remove();
                            }
                        });
                        const rng = context.invoke('getLastRange');
                        let nodes = rng.nodes();
                        if (nodes.length > 1) {
                            alert('More than one node is selected.');
                        } else if (rng.isOnTab() || rng.isOnAccordion()) {
                            alert('You cannot insert tabs inside a tab or accordion heading.');
                        } else {
                            ui.showDialog(self.$dialog);
                        }
                    });
                };

                this.update = function () {
                    if (!context.invoke('editor.hasFocus')) {
                        this.hide();
                        return;
                    }
                    this.rng = context.invoke('createRange', $editable);
                    this.nodes = this
                        .rng
                        .nodes();
                    if (this.rng.isOnAccordion()) {
                        if (this.nodes.length == 1 && $(this.nodes[0]).closest('.accordion-container')) {
                            const ph = $(this.nodes[0])
                                .get(0)
                                .parentElement;
                            const pos = $(ph).offset();
                            const height = $(ph).outerHeight(true); // include margin
                            this
                                .$popover
                                .css({
                                    display: 'block',
                                    left: pos.left,
                                    top: pos.top - height
                                });
                        }
                    } else {
                        //return false;
                        this.hide();
                    }

                };

                // This methods will be called when editor is destroyed by
                // $('..').summernote('destroy'); You should remove elements on `initialize`.
                this.destroy = function () {
                    this
                        .$dialog
                        .remove();
                    this.$dialog = null;
                };

                this.hide = function () {
                    this
                        .$popover
                        .hide();
                }
            }
        });
    }));