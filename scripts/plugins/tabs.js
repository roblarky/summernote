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

        "tabs": function (context) {
            var self = this
                rng = null,
                nodes = null,
                ui = $.summernote.ui,
                context = context,
                options = context.options,
                $editor = context.layoutInfo.editor,
                $editable = context.layoutInfo.editable,
                editable = $editable[0];

                context.memo('button.tabDialog', function () {
                    // create button
                    var button = this
                        .ui
                        .button({
                            contents: '<i class="fa fa-folder"/> Tabs',
                            container: false,
                            tooltip: "Insert a new set of tabs",
                            click: function () {
                                self.showDialog();
                            }
                        });

                    // create jQuery object from button instance.
                    return button.render();
                });

                context.memo('button.addtab', function () {
                    // create button
                    var button = ui.button({
                        contents: '<i class="fa fa-plus"/>',
                        container: false,
                        tooltip: "Insert new tab to the right",
                        click: function () {
                            self.addTab();
                            self.hide();
                        }
                    });
                    return button.render();
                });

                context.memo('button.removetab', function () {
                    // create button
                    var button = ui.button({
                        contents: '<i class="fa fa-trash"/>',
                        container: false,
                        tooltip: "Delete tab",
                        click: function () {
                            if (confirm('Are you sure you want to remove this tab?')) {
                                self.removeTab();
                                self.hide();
                            }
                        }
                    });
                    return button.render();
                });

                context.memo('button.tableft', function () {
                    // create button
                    var button = ui.button({
                        contents: '<i class="fa fa-chevron-left"/>',
                        container: false,
                        tooltip: "Move tab to the left",
                        click: function () {
                            self.moveTabLeft();
                        }
                    });
                    return button.render();
                });

                context.memo('button.tabright', function () {
                    // create button
                    var button = ui.button({
                        contents: '<i class="fa fa-chevron-right"/>',
                        container: false,
                        tooltip: "Move tab to the right",
                        click: function () {
                            self.moveTabRight();
                        }
                    });
                    return button.render();
                });

                context.memo('button.tabhidepopover', function () {
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

                this.initialize = function () {
                    var $container = options.dialogsInBody
                            ? $(document.body)
                            : context.layoutInfo.editor,
                        body = '<button href="#" class="btn btn-primary" id="add-tab">Add Tab</button>',
                        footer = '<button href="#" class="btn btn-primary" id="insert-tab">Insert Tabs</button>',
                        tabInput = '<div class="card"><div class="card-body"><i class="fa fa-close pull-right" aria-' +
                                'hidden="true"></i><div class="form-group"><label>Tab Title</label><input class="' +
                                'form-control" type="text" /></div><div class="form-group"><label>Tab Content</la' +
                                'bel><textarea class="form-control" rows="4" /></div></div></div>';

                    //Create dialog
                    this.$dialog = ui
                        .dialogLarge({title: "Insert Tabs", fade: options.dialogsFade, body: body, footer: footer})
                        .render()
                        .appendTo($container);

                    //Create logic for Add button and Delete button
                    var $addBtn = self
                        .$dialog
                        .find('#add-tab')
                        .click(function (event) {
                            console.log('tabs: addBtn.click');
                            event.preventDefault();
                            $addBtn.before(tabInput);
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
                        className: 'note-tabs-popover',
                        callback: ($node) => {
                            const $content = $node.find('.popover-content,.note-popover-content');
                        }
                    })
                        .render()
                        .appendTo(options.container);
                    const $content = this
                        .$popover
                        .find('.popover-content,.note-popover-content');

                    context.invoke('buttons.build', $content, options.popover.tabs);
                }

                this.moveTabLeft = function () {
                    let currentTab = $(this.nodes[0])
                        .closest('.nav-item')
                        .get(0);
                    let previousTab = currentTab.previousElementSibling;
                    if (previousTab) {
                        let newNode = currentTab
                            .parentNode
                            .insertBefore(currentTab, previousTab);
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

                this.moveTabRight = function () {
                    let currentTab = $(this.nodes[0])
                        .closest('.nav-item')
                        .get(0);
                    let nextTab = currentTab.nextElementSibling;
                    if (nextTab) {
                        let newNode = currentTab
                            .parentNode
                            .insertBefore(nextTab, currentTab);
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

                this.addTab = function () {
                    let contentId = $(this.nodes[0].parentElement).attr('aria-controls');
                    let currentTab = $(this.nodes[0])
                        .closest('.nav-item')
                        .get(0);
                    let currentContent = document.getElementById(contentId);
                    //Get name of ul container
                    let tabContainer = $(currentTab)
                        .closest('.tabs-container')
                        .get(0);
                    let newId = 'newTab' + new Date().getTime();
                    var newTab = document.createElement('li');
                    newTab
                        .classList
                        .add('nav-item');
                    newTab.innerHTML = '<a class="nav-link" id="' + newId + '-tab" data-toggle="tab" href="#' + newId + '-tab-content" role="tab" aria-controls="' + newId + '-tab-content" aria-selected="true">New Tab</a>';
                    tabContainer.insertBefore(newTab, currentTab.nextElementSibling);
                    //Get tab content container
                    let tabContentContainer = document.getElementById(tabContainer.id + 'Content');
                    var newTabContent = document.createElement('div');
                    newTabContent
                        .classList
                        .add('tab-pane');
                    newTabContent
                        .classList
                        .add('fade');
                    newTabContent.id = newId + '-tab-content';
                    newTabContent.setAttribute('role', 'tabpanel');
                    newTabContent.setAttribute('aria-labelledby', newId + '-tab');
                    newTabContent.innerHTML = "<p>Add Content Here</p>";
                    tabContentContainer.insertBefore(newTabContent, currentContent.nextElementSibling);
                    $('#' + newId + '-tab').trigger('click');
                }

                this.removeTab = function () {
                    //Current tab
                    let contentId = $(this.nodes[0].parentElement).attr('aria-controls');
                    let currentTab = $(this.nodes[0])
                        .closest('.nav-item')
                        .get(0);
                    //Get name of ul container
                    let tabContainer = $(currentTab)
                        .closest('.tabs-container')
                        .get(0);
                    //Get tab content container
                    let tabContentContainer = document.getElementById(tabContainer.id + 'Content');
                    let previousTab = currentTab.previousElementSibling;
                    let nextTab = currentTab.nextElementSibling;
                    //Remove tab
                    currentTab.remove();

                    //Remove tab content
                    let content = document.getElementById(contentId);
                    content.remove();

                    //if there are no other tabs, remove tab containers
                    if ($(tabContainer).find('.nav-item').length == 0) {
                        if ($(tabContainer).closest('.tabs-block')) {
                            $(tabContainer)
                                .closest('.tabs-block')
                                .remove();
                        } else {
                            tabContentContainer.remove();
                            tabContainer.remove();
                        }
                    } else {
                        if (previousTab) {
                            $(previousTab)
                                .find('.nav-link')
                                .last()
                                .trigger('click');
                        } else if (nextTab) {
                            $(nextTab)
                                .find('.nav-link')
                                .last()
                                .trigger('click');
                        }
                    }
                }

                this.showDialog = function () {
                    context.invoke('editor.saveRange');

                    this
                        .showTabsDialog()
                        .then(function (data) {
                            const rng = context.invoke('getLastRange');
                            let nodes = rng.nodes();
                            // [workaround] hide dialog before restore range for IE range focus
                            ui.hideDialog(self.$dialog);
                            context.invoke('editor.restoreRange');

                            //Create tabs
                            if (data.length > 0) {
                                var tabId = "tab" + new Date().getTime();
                                var toInsert = '<ul class="nav nav-tabs tabs-container" id="' + tabId + '" role="tablist">';
                                var activeTab = 'active';
                                for (var i = 0; i < data.length; i++) {
                                    var myId = tabId + (i + 1);
                                    toInsert += '<li class="nav-item">';
                                    toInsert += '   <a class="nav-link ' + activeTab + '" id="' + myId + '-tab" data-toggle="tab" href="#' + myId + '-tab-content" role="tab" aria-controls="' + myId + '-tab-content" aria-selected="true">' + data[i].title + '</a>';
                                    toInsert += '</li>';
                                    activeTab = '';
                                }
                                toInsert += '</ul>';
                                toInsert += '<div class="tab-content" id="' + tabId + 'Content">'
                                activeTab = 'show active';
                                for (var i = 0; i < data.length; i++) {
                                    var myId = tabId + (i + 1);
                                    toInsert += '<div class="tab-pane fade ' + activeTab + '" id="' + myId + '-tab-content" role="tabpanel" aria-labelledby="' + myId + '-tab"><p>' + data[i].content + '</p></div>';
                                    activeTab = '';
                                }

                                toInsert += '</div>';
                                var div = document.createElement('div');
                                div
                                    .classList
                                    .add('tabs-block');
                                div.innerHTML = toInsert;
                                if (nodes.length > 1) {
                                    alert('More than 1 HTML element is selected. Simplify your selection before adding tabs' +
                                            '.');
                                } else if ($(nodes[0]).closest('.tab-pane').length || $(nodes[0]).closest('.card-body').length) {
                                    //If this is inside of a tab panel, directly insert node
                                    // TODO: Only do this for a single node..probably need to disable tab if more
                                    // than 1 node selected
                                    nodes[0]
                                        .parentNode
                                        .insertBefore(div, nodes[0].nextEleSibling);
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
                }

                this.showTabsDialog = function () {
                    return $.Deferred(function (deferred) {
                        ui
                            .onDialogShown(self.$dialog, function () {
                                //Add resolve to insert button
                                var $insertBtn = self
                                    .$dialog
                                    .find('#insert-tab');
                                context.triggerEvent('dialog.shown');
                                $insertBtn.off('click');
                                $insertBtn.click(function (event) {
                                    console.log('tabs: insertBtn.click');
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
                            console.log('tabs::onDialogHidden');
                            // Remove panel
                            var $tabPanel = self
                                .$dialog
                                .find('.card');
                            for (var i = 0; i < $tabPanel.length; i++) {
                                $tabPanel[i].remove();
                            }
                        });
                        const rng = context.invoke('getLastRange');
                        let nodes = rng.nodes();
                        if (nodes.length > 1) {
                            alert('More than 1 HTML element is selected. Simplify your selection before adding tabs' +
                                    '.');
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
                    if (this.rng.isOnTab()) {
                        if (this.nodes.length == 1 && $(this.nodes[0]).closest('.tabs-container')) {
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

                this.destroy = function () {
                    this
                        .$dialog
                        .remove();
                    this.$dialog = null;
                    this
                        .$popover
                        .remove();
                    this.$popover = null;
                }

                this.hide = function () {
                    this
                        .$popover
                        .hide();
                }
            }
        });
    }));