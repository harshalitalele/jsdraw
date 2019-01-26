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
    function getElement(elemProp) {
        if(elemProp.hasOwnProperty("id")) {
            return document.getElementById(elemProp.id);
        } else {
            return document.body;
        }
    }
    
    function createOverlay(elemProp) {
        var overlay = document.createElement("canvas"),
            element = getElement(elemProp),
            parentRect = element.getClientRects()[0];
        overlay.width = parentRect.width;
        overlay.height = parentRect.height;
        var overlayStyle = overlay.style;
        overlayStyle.width = parentRect.width + "px";
        overlayStyle.height = parentRect.height + "px";
        overlayStyle.position = "absolute";
        overlayStyle.top = 0;
        overlayStyle.left = 0;
        element.appendChild(overlay);
        return overlay;
    }
    
    b.Overlay = function(elemProp) {
        this.canvas = createOverlay(elemProp);
    };
    
    b.Overlay.prototype.show = function() {
        this.canvas.style.display = "block";
    }
    
    b.Overlay.prototype.hide = function() {
        this.canvas.style.display = "none";
    }
} (DrawingBoard));