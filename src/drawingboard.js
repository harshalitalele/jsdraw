/*
 * Copyright 2019 Harshali Talele  <https://github.com/harshalitalele/jsdraw>
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
function DrawingBoard(options) {
    return new DrawingBoard.Board(options);
}

(function(b) {
    var defaultOptions = {
        boardBase: 'body',
        drawStyles: ['freeform'],
        saveHandler: function() {
            console.log("There is no custom Save handler");
        },
        clearAllHandler: function() {
            console.log("There is no custom Clear All handler");
        },
        toolboxStyles: {},
        elemProp: {}
    };    
    
    b.Board = function(options) {
        options = Object.assign(defaultOptions, options);
        //To Do: Remove all extra options if there from options by comparing with defaultOptions object
        //To Do: Check if we need below 2 properties
        this.saveHandler = options.saveHandler;
        this.clearAllHandler = options.clearAllHandler;
        
        var overlay = new b.Overlay(options.elemProp);
        
        this.toolbox = new b.Toolbox({
            overlay: overlay.canvas,
            controls: {
                saveHandler: function(markers) {
                    options.saveHandler(markers);
                },
                clearAllHandler: function() {}
            }
        });
        this.showToolbox = function() {
            this.toolbox.show();
            overlay.show();
        };
        this.hideToolbox = function() {
            this.toolbox.hide();
            overlay.hide();
        };        
    }
}(DrawingBoard));
