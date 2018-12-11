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

        "slider": function (context) {
            var self = this
                rng = null,
                nodes = null,
                ui = $.summernote.ui,
                context = context,
                options = context.options,
                $editor = context.layoutInfo.editor,
                $editable = context.layoutInfo.editable,
                editable = $editable[0];

                context.memo('button.sliderDialog', function () {
                    // create button
                    var button = this
                        .ui
                        .button({
                            contents: '<i class="fa fa-film"/>',
                            container: false,
                            tooltip: "Insert a new slideshow",
                            click: function () {
                                self.showDialog();
                            }
                        });

                    // create jQuery object from button instance.
                    return button.render();
                });

                /* This is a template for popover button, would need to also add entry to summernote options
                context.memo('button.uniquebtnname', function () {
                    // create button
                    var button = ui.button({
                        contents: '<i class="fa fa-plus"/>',
                        container: false,
                        tooltip: "",
                        click: function () {
                            self.addTab(); //change to function name when defined, e.g. this.newFunction, to fire on popover button click
                            self.hide();
                        }
                    });
                    return button.render();
                });
                */


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
                        body = '<div class="container">' +
                               '  <div class="row flex-nowrap" id="sliderGroupContainer" style="overflow-x: auto;white-space: nowrap;"></div>' + 
                               '</div>' +
                               '<div class="pt-2 pb-2">' +
                               '  <button href="#" class="btn btn-primary" id="add-image">Add Image</button> ' +
                               '  <button href="#" class="btn btn-primary" id="add-video">Add Video</button>' +
                               '</div>' +
                               '<div class="card" id="sliderMainCard"><div class="card-body">' +
                               '  <div class="row">' +
                               '    <div class="col-md-6 form-group">' +
                               '      <label>Location</label>' +
                               '      <select class="form-control" id="sliderLocation">' +
                               '          <option value="center top">Center Top</option>' +
                               '          <option value="center middle" selected="selected">Center Middle</option>' +
                               '          <option value="center bottom">Center Bottom</option>' +
                               '          <option value="left top">Left Top</option>' +
                               '          <option value="left middle">Left Middle</option>' +
                               '          <option value="left bottom">Left Bottom</option>' +
                               '          <option value="right top">Right Top</option>' +
                               '          <option value="right middle">Right Middle</option>' +
                               '          <option value="right bottom">Right Bottom</option>' +
                               '      </select>' +
                               '    </div>' +    
                               '    <div class="col-md-6 form-group">' +
                               '      <label>Height</label>' +
                               '      <input class="form-control" id="sliderHeight" type="number" value="500" step="25" />' +
                               '    </div>' +
                               '  </div>' +
                               '  <div class="row">' +
                               '    <div class="col-md-6 form-group">' +
                               '      <label>Location</label>' +
                               '      <select class="form-control" id="sliderEffect">' +
                               '          <option value="fade" selected="selected">Fade</option>' +
                               '          <option value="slide left">Slide Left</option>' +
                               '          <option value="slide right">Slide Right</option>' +
                               '          <option value="slide down">Slide Down</option>' +
                               '          <option value="slide up">Slide Up</option>' +
                               '      </select>' +
                               '    </div>' +                                 
                               '    <div class="col-md-6 form-group">' +
                               '      <label>Speed</label>' +
                               '      <input class="form-control" id="sliderSpeed" type="number" value="0.5" step="0.5" />' +
                               '    </div>' +
                               '  </div>' +
                               '  <div class="row">' +
                               '    <div class="col-md-6 form-check">' +
                               '      <input type="checkbox" class="form-check-input" id="sliderAutoPlay" checked="checked">' +
                               '      <label class="form-check-label" for="sliderAutoPlay">Auto Play</label>' +
                               '    </div>' +
                               '    <div class="col-md-6 form-group">' +
                               '      <label>Interval</label>' +
                               '      <input class="form-control" id="sliderInterval" type="number" value="4.0" step="0.5" />' +
                               '    </div>' +                               
                               '  </div>' +
                               '</div></div>',
                        footer = '<button href="#" class="btn btn-primary" id="insert-slider">Insert Slider</button>';                             

                    //Create dialog
                    this.$dialog = ui
                        .dialogLarge({title: "Insert Slider", fade: options.dialogsFade, body: body, footer: footer})
                        .render()
                        .appendTo($container);

                    //Create logic for Add button and Delete button
                    var $addImage = self
                        .$dialog
                        .find('#add-image')
                        .off('click')
                        .click(function (event) {
                            console.log('slider: addImage.click');
                            event.preventDefault();
                            let imageInputId = 'newImageSlide' + new Date().getTime();
                            let imageInput = '<div class="card col-sm-10 mr-2 mb-2" style="display: inline-block;float: none;">';
                            imageInput += '<div class="card-body">';
                            imageInput += '   <div class="pb-4">';
                            imageInput += '      <i class="fa fa-close pull-right" aria-hidden="true"></i>';
                            imageInput += '      <i class="fa fa-chevron-right pull-right" aria-hidden="true"></i>';
                            imageInput += '      <i class="fa fa-chevron-left pull-right" aria-hidden="true"></i>';
                            imageInput += '   </div>';            
                            imageInput += '   <div class="row">';                
                            imageInput += '    <input class="form-control" type="hidden" value="image" />';
                            imageInput += '    <div class="col-md-4">';   
                            imageInput += '      <img src="todo" />'; 
                            imageInput += '    </div>'; 
                            imageInput += '    <div class="col-md-8">';   
                            imageInput += '     <div class="form-group">';
                            //imageInput += '        <label>Title</label>';
                            imageInput += '        <input class="form-control" type="text" placeholder="Title (optional)" />';
                            imageInput += '     </div>';
                            imageInput += '     <div class="form-group">';
                            //imageInput += '        <label>Description</label>';
                            imageInput += '        <textarea class="form-control" rows="2" placeholder="Description (optional)" />';
                            imageInput += '     </div>';
                            imageInput += '     <div class="form-group">';
                            //imageInput += '        <label>Link URL</label>';
                            imageInput += '        <input class="form-control" type="text" placeholder="Link URL (optional)" />';
                            imageInput += '     </div>';                            
                            imageInput += '     <div class="form-group">';
                            //imageInput += '        <label>Image URL</label>';
                            imageInput += '        <input class="form-control" id="' + imageInputId + '" type="text" placeholder="Image URL" />';
                            imageInput += '     </div>';  
                            imageInput += '    </div>'; 
                            imageInput += '   </div>';                          
                            imageInput += '</div></div>'                            
                            $('#summernoteImageBrowserModal').attr('data-target-field', '#' + imageInputId);                            
                            //$addImage.before(imageInput);
                            $('#sliderGroupContainer').append(imageInput);
                            let far = $('#sliderGroupContainer').width();
                            let pos = $('#sliderGroupContainer').scrollLeft() + far;
                            $('#sliderGroupContainer').animate( { scrollLeft: pos }, 500 );                            
                            //$.get("/Admin/ContentEditor/_ImageBrowserModalContent", function (data) { //TODO: (CMS) Pass along something to not show modal form fields
                            //    $(".modal-content", '#summernoteImageBrowserModal').html(data);
                                $(".modal-content", '#summernoteImageBrowserModal').html('Test Image Browser HTML<button onclick="$(\'#' + imageInputId + '\').val(\'test image val\');">test</button>'); //test only, uncomment wrapped area
                                $('#summernoteImageBrowserModal').off("shown.bs.modal");
                                $('#summernoteImageBrowserModal').on("shown.bs.modal", function () {
                                    console.log("Slider Image Browser: shown.bs.modal");
                                    $(document).trigger("editor.imagebrowser.ready"); //TODO bind this in admin.js to handle slider insert fields
                                });
                                $('#summernoteImageBrowserModal').modal('show');
                            //});                            
                            var $deleteBtn = self
                                .$dialog
                                .find('.fa-close')
                                .off('click')
                                .click(function (event) {
                                    event.preventDefault();
                                    event
                                        .currentTarget
                                        .parentNode
                                        .parentNode
                                        .remove();
                                });
                            var $moveLeftBtn = self
                                .$dialog
                                .find('.fa-chevron-left')
                                .off('click')
                                .click(function (event) {
                                    event.preventDefault();
                                    if(event.currentTarget.parentNode.parentNode.parentNode.previousElementSibling) {
                                        event.currentTarget.parentNode.parentNode.parentNode.parentNode.insertBefore(event.currentTarget.parentNode.parentNode.parentNode, event.currentTarget.parentNode.parentNode.parentNode.previousElementSibling);
                                    }
                                });      
                            var $moveRightBtn = self
                                .$dialog
                                .find('.fa-chevron-right')
                                .off('click')
                                .click(function (event) {
                                    event.preventDefault();
                                    if(event.currentTarget.parentNode.parentNode.parentNode.nextElementSibling) {
                                        event.currentTarget.parentNode.parentNode.parentNode.parentNode.insertBefore(event.currentTarget.parentNode.parentNode.parentNode.nextElementSibling, event.currentTarget.parentNode.parentNode.parentNode);
                                    }
                                });                              
                        });

                        var $addVideo = self
                        .$dialog
                        .find('#add-video')
                        .off('click')
                        .click(function (event) {
                            console.log('slider: addVideo.click');
                            event.preventDefault();
                            let videoInputId = 'newVideoSlide' + new Date().getTime();
                            let videoInput = '<div class="card col-sm-10 mr-2 mb-2" style="display: inline-block;float: none;">';
                            videoInput += '<div class="card-body">';
                            videoInput += '   <div class="pb-4">';
                            videoInput += '      <i class="fa fa-close pull-right" aria-hidden="true"></i>';
                            videoInput += '      <i class="fa fa-chevron-right pull-right" aria-hidden="true"></i>';
                            videoInput += '      <i class="fa fa-chevron-left pull-right" aria-hidden="true"></i>';
                            videoInput += '   </div>';            
                            videoInput += '   <div class="row">';    
                            videoInput += '    <input class="form-control" type="hidden" value="video" />';            
                            videoInput += '    <div class="col-md-4">';   
                            videoInput += '      <img src="todo" />'; 
                            videoInput += '    </div>'; 
                            videoInput += '    <div class="col-md-8">';   
                            videoInput += '     <div class="form-group">';
                            //videoInput += '        <label>Title</label>';
                            videoInput += '        <input class="form-control" type="text" placeholder="Title (optional)" />';
                            videoInput += '     </div>';
                            videoInput += '     <div class="form-group">';
                            //videoInput += '        <label>Description</label>';
                            videoInput += '        <textarea class="form-control" rows="2" placeholder="Description (optional)" />';
                            videoInput += '     </div>';
                            videoInput += '     <div class="form-group">';
                            //videoInput += '        <label>Link URL</label>';
                            videoInput += '        <input class="form-control" type="text" placeholder="Link URL (optional)" />';
                            videoInput += '     </div>';                            
                            videoInput += '     <div class="form-group">';
                            //videoInput += '        <label>Image URL</label>';
                            videoInput += '      <input class="form-control" id="' + videoInputId + '" type="text" placeholder="Image URL" />';
                            videoInput += '     </div>';  
                            videoInput += '    </div>'; 
                            videoInput += '   </div>';                          
                            videoInput += '</div></div>'                              
                            $('#summernoteYouTubeBrowserModal').attr('data-target-field', '#' + videoInputId);
                            //$addImage.before(videoInput);
                            $('#sliderGroupContainer').append(videoInput);
                            let far = $('#sliderGroupContainer').width();
                            let pos = $('#sliderGroupContainer').scrollLeft() + far;
                            $('#sliderGroupContainer').animate( { scrollLeft: pos }, 500 );                            
                            //$.get("/Admin/ContentEditor/_YouTubeBrowserModalContent", function (data) { //TODO: (CMS) Pass along something to not show modal form fields
                            //    $(".modal-content", '#summernoteYouTubeBrowserModal').html(data);
                                $(".modal-content", '#summernoteYouTubeBrowserModal').html('Test Image Browser HTML<button onclick="$(\'#' + videoInputId + '\').val(\'test video val\');">test</button>'); //test only, uncomment wrapped area
                                $('#summernoteYouTubeBrowserModal').off("shown.bs.modal");
                                $('#summernoteYouTubeBrowserModal').on("shown.bs.modal", function () {
                                    console.log("Slider YouTube Browser: shown.bs.modal");
                                    $(document).trigger("editor.youtubebrowser.ready"); //TODO bind this in admin.js to handle slider insert fields
                                });
                                $('#summernoteYouTubeBrowserModal').modal('show');
                            //});                             
                            var $deleteBtn = self
                                .$dialog
                                .find('.fa-close')
                                .off('click')
                                .click(function (event) {
                                    event.preventDefault();
                                    event
                                        .currentTarget
                                        .parentNode
                                        .parentNode
                                        .remove();
                                });
                            var $moveLeftBtn = self
                                .$dialog
                                .find('.fa-chevron-left')
                                .off('click')
                                .click(function (event) {
                                    event.preventDefault();
                                    if(event.currentTarget.parentNode.parentNode.parentNode.previousElementSibling) {
                                        event.currentTarget.parentNode.parentNode.parentNode.parentNode.insertBefore(event.currentTarget.parentNode.parentNode.parentNode, event.currentTarget.parentNode.parentNode.parentNode.previousElementSibling);
                                    }
                                });      
                            var $moveRightBtn = self
                                .$dialog
                                .find('.fa-chevron-right')
                                .off('click')
                                .click(function (event) {
                                    event.preventDefault();
                                    if(event.currentTarget.parentNode.parentNode.parentNode.nextElementSibling) {
                                        event.currentTarget.parentNode.parentNode.parentNode.parentNode.insertBefore(event.currentTarget.parentNode.parentNode.parentNode.nextElementSibling, event.currentTarget.parentNode.parentNode.parentNode);
                                    }
                                });                                                             
                        });                        


                    /* Not sure if we'll use a popover, but leaving for the future
                    this.$popover = ui.popover({
                        className: 'note-slider-popover',
                        callback: ($node) => {
                            const $content = $node.find('.popover-content,.note-popover-content');
                        }
                        })
                        .render()
                        .appendTo(options.container);
                    const $content = this
                        .$popover
                        .find('.popover-content,.note-popover-content');

                    context.invoke('buttons.build', $content, options.popover.slider);
                    */
                }
                

                this.showDialog = function () {
                    context.invoke('editor.saveRange');

                    this
                        .showSliderDialog()
                        .then(function (data) {
                            const rng = context.invoke('getLastRange');
                            let nodes = rng.nodes();
                            // [workaround] hide dialog before restore range for IE range focus
                            ui.hideDialog(self.$dialog);
                            context.invoke('editor.restoreRange');

                            //Create slides
                            if (data.length > 0) {
                                //Get slider main form fields
                                let location = self.$dialog.find('#sliderLocation').val(),
                                    height = self.$dialog.find('#sliderHeight').val(),
                                    effect = self.$dialog.find('#sliderEffect').val(),
                                    speed = self.$dialog.find('#sliderSpeed').val(),
                                    autoPlay = self.$dialog.find('#sliderAutoPlay').get(0).checked,
                                    interval = self.$dialog.find('#sliderInterval').val();

                                var sliderId = "slider" + new Date().getTime();
                                var div = document.createElement('div');
                                div.id = sliderId;
                                div.classList.add('slideshow');
                                div.setAttribute('data-location', location);
                                div.setAttribute('data-height', height);
                                div.setAttribute('data-speed', speed);
                                div.setAttribute('data-effect', effect);
                                div.setAttribute('data-autoplay', autoPlay);
                                div.setAttribute('data-interval', interval);
                                var toInsert = '';
                                for (var i = 0; i < data.length; i++) {
                                    toInsert += '<div class="slide">';
                                    toInsert += '   <div class="slide-content">';
                                    if(data[i].title) {
                                        toInsert += '      <h2>' + data[i].title + '</h2>';
                                    }
                                    if(data[i].description) {
                                        toInsert += '      <p>' + data[i].description + '</p>';
                                    }
                                    if(data[i].linkURL) {
                                        toInsert += '      <a href="' + data[i].linkURL + '" class="btn btn-primary">Click for details</a>';
                                    }
                                    toInsert += '   </div>';
                                    toInsert += '   <div class="slide-image">';
                                    if(data[i].type === "image") {
                                        toInsert += '   <img src="' + data[i].imageURL + '" />';
                                    } else if(data[i].type === "video") {
                                        toInsert += '   <p>TODO: YouTube IFrame: ' + data[i].imageURL + '"</p>';
                                    }
                                    toInsert += '   </div>';                                    
                                    toInsert += '</div>';
                                }
                                div.innerHTML = toInsert;

                                if (nodes.length > 1) {
                                    alert('More than 1 HTML element is selected. Simplify your selection before adding a slider' +
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
                        })
                        .fail(function () {
                            context.invoke('editor.restoreRange');
                        });
                }

                this.showSliderDialog = function () {
                    return $.Deferred(function (deferred) {
                        ui
                            .onDialogShown(self.$dialog, function () {
                                //Add resolve to insert button
                                var $insertBtn = self
                                    .$dialog
                                    .find('#insert-slider');
                                context.triggerEvent('dialog.shown');
                                $insertBtn.off('click');
                                $insertBtn.click(function (event) {
                                    console.log('slider: insertBtn.click');
                                    event.preventDefault();
                                    // Get user data
                                    var data = [];
                                    var $formInput = self
                                        .$dialog
                                        .find('#sliderGroupContainer .form-control');
                                    for (var i = 0; i < $formInput.length; i = i + 5) {
                                        if($formInput[i].value){
                                            data.push({
                                                type: $formInput[i].value,
                                                title: $formInput[i + 1].value,
                                                description: $formInput[i + 2].value,
                                                linkURL: $formInput[i + 3].value,
                                                imageURL: $formInput[i + 4].value
                                            });
                                        }
                                    }
                                    deferred.resolve(data);
                                });
                            });

                        ui.onDialogHidden(self.$dialog, function () {
                            console.log('slider::onDialogHidden');
                            // Remove panel
                            var $sliderPanel = self
                                .$dialog
                                .find('.card:not(#sliderMainCard)');
                            for (var i = 0; i < $sliderPanel.length; i++) {
                                $sliderPanel[i].remove();
                            }
                        });
                        const rng = context.invoke('getLastRange');
                        let nodes = rng.nodes();
                        if (nodes.length > 1) {
                            alert('More than 1 HTML element is selected. Simplify your selection before adding a slider' +
                                    '.');
                        } else if (rng.isOnTab() || rng.isOnAccordion()) {// || $(this.nodes[0]).closest('.tab-content') || $(this.nodes[0]).closest('.accordion-container')) {
                            alert('You cannot insert a slider inside a tab or accordion heading.');
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
                    /*
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
                    */

                };

                this.destroy = function () {
                    this
                        .$dialog
                        .remove();
                    this.$dialog = null;
                    /*this
                        .$popover
                        .remove();
                    this.$popover = null;
                    */
                }

                this.hide = function () {
                    /*this
                        .$popover
                        .hide();
                    */
                }
            }
        });
    }));