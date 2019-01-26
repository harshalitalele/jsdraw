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
(function(b) {
    
    var defaultOptions = {
        markers: ["freeform"],
        controls: {
            saveHandler: function() {},
            clearAllHandler: function() {}
        }
    };
    
    function addMarkersOptions(options, toolbox, onTypeSelected) {
        for(var m in options) {
            var mType = options[m],
                mElem = document.createElement("div"),
                mStyle = mElem.style;
            mStyle.height = "32px";
            mStyle.width = "32px";
            mStyle.margin = "5px";
            mStyle.border = "1px solid black";
            mStyle.borderRadius = "4px";
            switch(mType) {
                case "freeform":
                    mElem.innerText = "F";
                    mStyle.textAlign = "center";
                    mElem.addEventListener("click", function(e) {
                        onTypeSelected("freeform");
                    });
                    break;
            }            
            toolbox.appendChild(mElem);
        }
    }
    
    function addButtonControls(options, toolbox) {
        for(var c in options) {            
            if(options[c]) {
                var btn = document.createElement("button"),
                    btnStyle = btn.style;
                btnStyle.width = "32px";
                btnStyle.height = "32px";
                btnStyle.margin = "5px";
                btnStyle.border = "1px solid black";
                btnStyle.borderRadius = "4px";
                switch(c) {
                    case "saveHandler":
                        btn.innerText = "S";
                        btn.addEventListener("click", function(e) {
                            options.saveHandler();
                        });
                        break;
                    case "clearAllHandler":
                        btn.innerText = "X";
                        btn.addEventListener("click", function(e) {
                            options.clearAllHandler();
                        });
                        break;
                }
                toolbox.appendChild(btn);
            }
        }
    }
    
    function createToolboxElem(options) {
        var toolboxElem = document.createElement("div");
        tbStyle = toolboxElem.style;
        tbStyle.backgroundColor = "rgba(255,0,0,0.2)";
        tbStyle.width = "auto";
        tbStyle.height = "60px";
        tbStyle.padding = "5px";
        tbStyle.border = "1px solid black";
        tbStyle.borderRadius = "5px";
        tbStyle.position = "absolute";
        tbStyle.top = 0;
        tbStyle.right = 0;
        
        return toolboxElem;
    }
    
    b.Toolbox = function(options) {
        options = Object.assign(defaultOptions, options);
        
        var toolboxElem = createToolboxElem(options),
            allMarkers = [];
        if(options.hasOwnProperty("overlay")) {
            options.overlay.parentElement.appendChild(toolboxElem);
        } else {
            console.error("Toolbox: overlay property does not exists");
        }
        
        var actions = new b.actions(options.overlay);
        actions.attachActions();
        
        function showCanvas() {
            options.overlay.style.display = "block";
        }
        
        function hideCanvas() {
            var canvas = options.overlay;
            canvas.getContext("2d").clearRect(0, 0, canvas.width, canvas.height);
            canvas.style.display = "none";
        }
        
        hideCanvas();
        
        function onMarkerCreatedHandler(marker) {
            hideCanvas();
            allMarkers.push(marker);
        }
        
        function onTypeSelected(type) {
            showCanvas();
            var currentAction = null;
            switch(type) {
                case "freeform":
                    currentAction = new b.freeformAction();
                    break;
            }
            currentAction.setUpHandler(onMarkerCreatedHandler);
            actions.setBehavior(currentAction);
        }
        
        var parentSave = options.controls.saveHandler,
            parentClear = options.controls.clearAllHandler;
        options.controls.saveHandler = function() {
            parentSave(allMarkers);
        };
        options.controls.clearAllHandler = function() {
            for(var m in allMarkers) {
                allMarkers[m].deleteMarker();
            }
            allMarkers = [];
            parentClear(allMarkers);
        };
        
        addMarkersOptions(options.markers, toolboxElem, onTypeSelected);
        addButtonControls(options.controls, toolboxElem);
        
        b.Toolbox.prototype.get = function() {
            return toolboxElem;
        };
        
        b.Toolbox.prototype.show = function() {
            return toolboxElem.style.display = "block";
        };
        
        b.Toolbox.prototype.hide = function() {
            return toolboxElem.style.display = "none";
        };
    };
} (DrawingBoard));
