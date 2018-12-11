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

        "layouts": function (context) {
            var self = this
                rng = null,
                nodes = null,
                ui = $.summernote.ui,
                context = context,
                options = context.options,
                $editor = context.layoutInfo.editor,
                $editable = context.layoutInfo.editable,
                editable = $editable[0];

                context.memo('button.layoutDialog', function () {
                    // create button
                    var button = this
                        .ui
                        .button({
                            contents: '<i class="fa fa-columns"/>',
                            container: false,
                            tooltip: "Insert a new layout template",
                            click: function () {
                                self.showDialog();
                            }
                        });

                    // create jQuery object from button instance.
                    return button.render();
                });

                this.events = {
                    // This will be called after modules are initialized.
                    'summernote.init': function (we, e) {
                        //console.log('summernote initialized', we, e);
                    },
                };

                this.initialize = function () {
                    var $container = options.dialogsInBody
                            ? $(document.body)
                            : context.layoutInfo.editor,
                        body = String.raw`<div class="container">
                                            <div class="row">
                                                    <div class="col-sm-4">
                                                        <div class="form-group">
                                                            <select class="form-control" size="7" id="layoutsList">
                                                                <option value="layout1row" selected="selected">1 column</option>
                                                                <option value="layout2col50split">2 columns</option>
                                                                <option value="layout2row">1 column, 1 column</option>
                                                                <option value="layout2rowfeature2col50split">Feature, 2 col</option>
                                                                <option value="layout2row2col50split">2 cols, 2 cols</option>
                                                                <option value="layout3rowfeature1row2col50split">Feature, 1 col, 2 cols</option>
                                                                <option value="layout3rowfeature2row2col50split">Feature, 2 cols, 2 cols</option>
                                                            </select>
                                                        </div>
                                                        <div class="form-check">
                                                            <input class="form-check-input" type="checkbox" value="" id="layoutsIncludeHeading">
                                                            <label class="form-check-label" for="layoutsIncludeHeading">
                                                                Include Heading
                                                            </label>
                                                        </div>                    
                                                        <div class="form-check">
                                                            <input class="form-check-input" type="checkbox" value="" id="layoutsIncludeFooter">
                                                            <label class="form-check-label" for="layoutsIncludeFooter">
                                                                Include Footer
                                                            </label>
                                                        </div>    
                                                        <div class="form-check">
                                                                <input class="form-check-input" type="checkbox" value="" id="layoutsIncludeFiller">
                                                                <label class="form-check-label" for="layoutsIncludeFiller">
                                                                    Include Filler
                                                                </label>
                                                            </div>                                      
                                                    </div>
                                                    <div class="col-sm-8">
                                    
                                                        <div id="layoutsHeading" class="d-none">
                                                            <div>
                                                                <h1>Heading</h1>
                                                            </div>
                                                        </div>
                                    
                                                        <div class="card">
                                                            <div class="card-body" id="layoutsCurrentSelection">
                                                            </div>
                                                        </div>
                                    
                                                        <div id="layoutsFooter" class="d-none">
                                                            <div>
                                                                <p>Footer</p>
                                                            </div>
                                                        </div>                    
                                    
                                                        <div class="d-none" id="layout1row">
                                                            <div>
                                                                <p>Column 1</p>
                                                            </div>
                                                        </div>  
                                    
                                                        <div class="d-none" id="layout2rowfeature2col50split">
                                                            <div>
                                                                <p>Feature</p>
                                                            </div>
                                                            <div class="row">
                                                                <div class="col-sm-6">
                                                                    <p>Column 1</p>
                                                                </div>
                                                                <div class="col-sm-6">
                                                                    <p>Column 2</p>
                                                                </div>
                                                            </div>
                                                        </div>   

                                                        <div class="d-none" id="layout2col50split">
                                                            <div class="row">
                                                                <div class="col-sm-6">
                                                                    <p>Column 1</p>
                                                                </div>
                                                                <div class="col-sm-6">
                                                                    <p>Column 2</p>
                                                                </div>
                                                            </div>
                                                        </div>    
                                                        
                                                        <div class="d-none" id="layout2row2col50split">
                                                            <div class="row">
                                                                <div class="col-sm-6">
                                                                    <p>Row 1 Column 1</p>
                                                                </div>
                                                                <div class="col-sm-6">
                                                                    <p>Row 1 Column 2</p>
                                                                </div>
                                                            </div>
                                                            <div class="row">
                                                                <div class="col-sm-6">
                                                                    <p>Row 2 Column 1</p>
                                                                </div>
                                                                <div class="col-sm-6">
                                                                    <p>Row 2 Column 2</p>
                                                                </div>
                                                            </div>
                                                        </div>                     
                                    
                                                        <div class="card d-none" id="layout2row">
                                                            <div>
                                                                <p>Row 1 Column 1</p>
                                                            </div>
                                                            <div>
                                                                <p>Row 2 Column 1</p>
                                                            </div>                                
                                                        </div>  

                                                        <div class="d-none" id="layout3rowfeature1row2col50split">
                                                            <div>
                                                                <p>Feature</p>
                                                            </div>
                                                            <div>
                                                                <p>Row 1</p>
                                                            </div>
                                                            <div class="row">
                                                                <div class="col-sm-6">
                                                                    <p>Row 2 Column 1</p>
                                                                </div>
                                                                <div class="col-sm-6">
                                                                    <p>Row 2 Column 2</p>
                                                                </div>
                                                            </div>
                                                        </div>                                                          

                                                        <div class="d-none" id="layout3rowfeature2row2col50split">
                                                            <div>
                                                                <p>Feature</p>
                                                            </div>
                                                            <div class="row">
                                                                <div class="col-sm-6">
                                                                    <p>Row 1 Column 1</p>
                                                                </div>
                                                                <div class="col-sm-6">
                                                                    <p>Row 1 Column 2</p>
                                                                </div>
                                                            </div>
                                                            <div class="row">
                                                                <div class="col-sm-6">
                                                                    <p>Row 2 Column 1</p>
                                                                </div>
                                                                <div class="col-sm-6">
                                                                    <p>Row 2 Column 2</p>
                                                                </div>
                                                            </div>                                                            
                                                        </div>                                                          
                                    
                                                    </div>
                                                </div>
                                            </div>`,
                        footer = '<button href="#" class="btn btn-primary" id="insert-layout">Insert Layout</button>';

                    //Create dialog
                    this.$dialog = ui
                        .dialogLarge({title: "Insert Layout", fade: options.dialogsFade, body: body, footer: footer})
                        .render()
                        .appendTo($container);

                    //Create logic for Add button and Delete button
                    var $layoutChange = self
                        .$dialog
                        .find('#layoutsList')
                        .change(function (event) {
                            console.log('layouts: template change');
                            let headerBlock = '',
                            footerBlock = '';
                            if(self.$dialog.find('#layoutsIncludeHeading').is(':checked')){
                                headerBlock = self.$dialog.find('#layoutsHeading').html();
                            }
                            if(self.$dialog.find('#layoutsIncludeFooter').is(':checked')){
                                footerBlock = self.$dialog.find('#layoutsFooter').html();
                            }
                            let mainBlock = $('#'+$(this).val()).html();
                            self.$dialog.find('#layoutsCurrentSelection').html(headerBlock + mainBlock + footerBlock);
                            if(self.$dialog.find('#layoutsIncludeFiller').is(':checked')){
                                self.$dialog.find('#layoutsCurrentSelection p')
                                    .append(' - Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec eu faucibus magna. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae.');
                            }                            
                    });
                    var $layoutHeaderChange = self
                        .$dialog
                        .find('#layoutsIncludeHeading')
                        .change(function (event) {    
                            self.$dialog.find('#layoutsList').trigger('change')
                    });
                    var $layoutFooterChange = self
                        .$dialog
                        .find('#layoutsIncludeFooter')
                        .change(function (event) {    
                            self.$dialog.find('#layoutsList').trigger('change')
                    });
                    var $layoutFillerChange = self
                        .$dialog
                        .find('#layoutsIncludeFiller')
                        .change(function (event) {    
                            self.$dialog.find('#layoutsList').trigger('change')
                    });
                    self.$dialog.find('#layoutsList').trigger('change');
                }

                this.showDialog = function () {
                    context.invoke('editor.saveRange');

                    this
                        .showLayoutsDialog()
                        .then(function (data) {
                            const rng = context.invoke('editor.getLastRange');
                            let nodes = rng.nodes();
                            // [workaround] hide dialog before restore range for IE range focus
                            ui.hideDialog(self.$dialog);
                            context.invoke('editor.restoreRange');

                            //Create tabs
                            if (data.length > 0) {
                                var div = document.createElement('div');
                                div.innerHTML = data;
                                if (nodes.length > 1) {
                                    alert('More than 1 HTML element is selected. Simplify your selection before adding a layout' +
                                            '.');
                                } else if(nodes.length === 1) { //if ($(nodes[0]).closest('.tab-pane').length || $(nodes[0]).closest('.card-body').length) {
                                    //If this is inside of a tab panel, directly insert node
                                    // TODO: Only do this for a single node..probably need to disable tab if more
                                    // than 1 node selected
                                    if(nodes[0].nodeName === "#text") {                                    
                                        nodes[0]
                                            .parentNode
                                            .parentNode
                                            .replaceChild(div, nodes[0].parentNode);
                                    } else {
                                        nodes[0]
                                            .parentNode
                                            .replaceChild(div, nodes[0]);
                                            //.insertBefore(div, nodes[0].nextElementSibling);
                                    }
                                } else {
                                    // Let summernote insert the node, summernote will split/close nodes to ensure
                                    // HTML makes sense. This is good, but it does not work well inside a tab content
                                    // panel as it actually splits the tab container and inserts the node
                                    context.invoke('editor.insertNode', div);
                                }
                            }
                            self.$dialog.find('#layoutsIncludeHeading').prop('checked', false);
                            self.$dialog.find('#layoutsIncludeFooter').prop('checked', false);
                            self.$dialog.find('#layoutsIncludeFiller').prop('checked', false);
                            self.$dialog.find('#layoutsList').trigger('change');
                        })
                        .fail(function () {
                            context.invoke('editor.restoreRange');
                        });
                }

                this.showLayoutsDialog = function () {
                    return $.Deferred(function (deferred) {
                        ui
                            .onDialogShown(self.$dialog, function () {
                                //Add resolve to insert button
                                var $insertBtn = self
                                    .$dialog
                                    .find('#insert-layout');
                                context.triggerEvent('dialog.shown');
                                $insertBtn.off('click');
                                $insertBtn.click(function (event) {
                                    console.log('layouts: insertBtn.click');
                                    event.preventDefault();
                                    // Get user data
                                    var data = $('#layoutsCurrentSelection').html();
                                    deferred.resolve(data);
                                });
                            });

                        ui.onDialogHidden(self.$dialog, function () {
                            console.log('layouts::onDialogHidden');
                        });
                        const rng = context.invoke('getLastRange');
                        let nodes = rng.nodes();
                        if (nodes.length > 1) {
                            alert('More than 1 HTML element is selected. Simplify your selection before adding a layout' +
                                    '.');
                        } else if (rng.isOnTab() || rng.isOnAccordion()) {
                            alert('You cannot insert a layout inside a tab or accordion heading.');
                        } else {
                            ui.showDialog(self.$dialog);
                        }
                    });
                };

                this.destroy = function () {
                    this
                        .$dialog
                        .remove();
                    this.$dialog = null;
                }
            }
        });
    }));