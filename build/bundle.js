function DrawingBoard() {
    return new DrawingBoard.Board();
}

(function(b) {
    var defaultOptions = {
        boardBase: 'body',
        drawStyles: ['freeform'],
        saveHandler: function() {
            void 0;
        },
        clearAllHandler: function() {
            void 0;
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
                    void 0;
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
            void 0;
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
        void 0;
        this.canvas = createOverlay(elemProp);
    };
    
    b.Overlay.prototype.show = function() {
        this.canvas.style.display = "block";
    }
    
    b.Overlay.prototype.hide = function() {
        this.canvas.style.display = "none";
    }
} (DrawingBoard));
(function (b) {
    "use strict";
    
    var hasTouch = !!window.hasOwnProperty('ontouchstart'),
        ACTIONS = {
            DOWN: hasTouch ? "touchstart" : "mousedown",
            MOVE: hasTouch ? "touchmove" : "mousemove",
            UP: hasTouch ? "touchend" : "mouseup",
            LEAVE: hasTouch ? "touchleave" : "mouseleave"
        };
    
    b.actions = function (overlayElem) {
        this.baseElement = overlayElem;
        this.isActionStarted = false;
        this.isActionCompleted = false;
        this.implementedAction = null;
    };
        
    b.actions.prototype.attachActions = function () {
        var selfActions = this;
        
        function getRelativePoints(x, y) {
            var parentPos = selfActions.baseElement.getClientRects()[0];
            return {x: x - parentPos.left, y: y - parentPos.top};
        }
        
        this.mousedownListener = function (event) {
            selfActions.isActionStarted = true;
            selfActions.isActionCompleted = false;
            selfActions.baseElement.width = parseFloat(selfActions.baseElement.getClientRects()[0].width);
            selfActions.baseElement.height = parseFloat(selfActions.baseElement.getClientRects()[0].height);
        };

        this.mousemoveListener = function (event) {
            if (selfActions.isActionStarted && !selfActions.isActionCompleted) {
                if (!event.x || !event.y) {
                    event.x = event.touches[0].clientX;
                    event.y = event.touches[0].clientY;
                }
                selfActions.implementedAction.actionChangeBehavior(selfActions.baseElement, getRelativePoints(event.x, event.y));
            }
        };

        this.mouseupListener = function (event) {
            selfActions.isActionStarted = false;
            selfActions.isActionCompleted = true;
            if (!event.x || !event.y) {
                event.x = event.touches[0].clientX;
                event.y = event.touches[0].clientY;
            }
            selfActions.implementedAction.actionCompleteBehavior(selfActions.baseElement, getRelativePoints(event.x, event.y));
        };

        this.mouseleaveListener = function (event) {
            selfActions.isActionStarted = false;
            selfActions.isActionCompleted = true;
        };
        
        this.baseElement.addEventListener(ACTIONS.DOWN, this.mousedownListener);
        this.baseElement.addEventListener(ACTIONS.MOVE, this.mousemoveListener);
        this.baseElement.addEventListener(ACTIONS.UP, this.mouseupListener);
        this.baseElement.addEventListener(ACTIONS.LEAVE, this.mouseleaveListener);
    };
    
    b.actions.prototype.detachActions = function () {
        this.baseElement.removeEventListener(ACTIONS.DOWN, this.mousedownListener);
        this.baseElement.removeEventListener(ACTIONS.MOVE, this.mousemoveListener);
        this.baseElement.removeEventListener(ACTIONS.UP, this.mouseupListener);
        this.baseElement.removeEventListener(ACTIONS.LEAVE, this.mouseleaveListener);
    };
    
    b.actions.prototype.setBehavior = function (implementedAction) {
        //To Do: validate allowed if implementedAction is among the allowed ones
        this.implementedAction = implementedAction;
    };
    
}(DrawingBoard));

(function(b) {
    
    var actionCompleted = true;
    
    function getSlope(p1, p2) {
        return (p2.y-p1.y)/(p2.x-p1.x);
    }
    
    function zipPoints(points, tolerance) {
        tolerance = tolerance || parseFloat(document.getElementById("tolerance").value);
        var zippedPointsSet = [points[0], points[1]],
            lastPoint = points[0],
            lastSlope = getSlope(points[1], lastPoint),
            origDatasetLen = points.length,
            ptDist = 3;
        
        for(var i = 2; i < origDatasetLen; i++) {
            var currentPt = points[i];
            //check for nearness
            if(Math.abs(currentPt.x - lastPoint.x) < ptDist && Math.abs(currentPt.y - lastPoint.y) < ptDist) {
                continue;
            } else {
                //check for slope
                var currentSlope = getSlope(currentPt, lastPoint);
                if(Math.abs(currentSlope - lastSlope) < tolerance) {
                    zippedPointsSet.pop();
                }
                zippedPointsSet.push(currentPt);
                lastPoint = currentPt;
                lastSlope = currentSlope;
            }
        }
        return zippedPointsSet;
    }
    
    function updateActionBoundaries(point, boundaries) {
        if (point.x < boundaries.x) {
            boundaries.width += boundaries.x - point.x;
            boundaries.x = point.x;
        } else if (point.x > (boundaries.x + boundaries.width)) {
            boundaries.width = point.x - boundaries.x;
        }
        if (point.y < boundaries.y) {
            boundaries.height += boundaries.y - point.y;
            boundaries.y = point.y;
        } else if (point.y > (boundaries.y + boundaries.height)) {
            boundaries.height = point.y - boundaries.y;
        }
    }
    
    function getActionBoundaries(points) {
        var pointIndex,
            actionBoundaries = {
                x: points[0].x,
                y: points[0].y,
                width: 0,
                height: 0
            },
            x2 = points[0].x,
            y2 = points[0].y;
        
        for (pointIndex = 1; pointIndex < points.length; pointIndex = pointIndex + 1) {
            //To Do: See if there is any optimum way of doing this
            var point = points[pointIndex];
            if (point.x < actionBoundaries.x) {
                actionBoundaries.x = point.x;
            } else if (point.x > x2) {
                x2 = point.x;
            }
            actionBoundaries.width = x2 - actionBoundaries.x;
            if (point.y < actionBoundaries.y) {
                actionBoundaries.y = point.y;
            } else if (point.y > y2) {
                y2 = point.y;
            }
            actionBoundaries.height = y2 - actionBoundaries.y;
        }
        return actionBoundaries;
    }
    
    b.freeformAction = function(marker, actionBoundaries) {
        marker = marker || {};
        this.type = "Freeform";
        this.color = "#00ff00";
        this.lineWidth = 4;
        this.points = [];
        this.comment = "";
        Object.assign(this, marker);
        this.actionBoundaries = actionBoundaries || (this.points && this.points.length > 0 ? getActionBoundaries(this.points) : {x: 0, y: 0, width: 0, height: 0});
        this.element = null;
        this.upHandler = null;
    };
    
    b.freeformAction.prototype.actionChangeBehavior = function (baseElement, point) {
        var context = baseElement.getContext("2d");
        context.strokeStyle = this.color;
        context.lineWidth = this.lineWidth;
        if (actionCompleted) {
            this.actionBoundaries.x = point.x;
            this.actionBoundaries.y = point.y;
            context.beginPath();
            context.moveTo(point.x, point.y);
            this.points.push(point);
            actionCompleted = false;
        } else {
            context.lineTo(point.x, point.y);
            context.stroke();
            this.points.push(point);
            updateActionBoundaries(point, this.actionBoundaries);
        }
    };
    
    b.freeformAction.prototype.actionCompleteBehavior = function (baseElement, point) {
        var context = baseElement.getContext("2d");
        context.lineTo(point.x, point.y);
        context.stroke();
        context.closePath();
        this.points.push(point);
        updateActionBoundaries(point, this.actionBoundaries);
        
        this.showMarker(this.points, baseElement.parentNode);
        
        actionCompleted = true;
        this.upHandler(this);
    };
    
    b.freeformAction.prototype.fillColor = function (color) {
        var color = "blue";
        var canvasElem = document.createElement("canvas");
        canvasElem.width = this.actionBoundaries.width;
        canvasElem.height = this.actionBoundaries.height;
        canvasElem.style.width = this.actionBoundaries.width + "px";
        canvasElem.style.height = this.actionBoundaries.height + "px";
        var ctx = canvasElem.getContext("2d");
        ctx.beginPath();
        
        var pts = this.points,
            offsetPt = {x : this.actionBoundaries.x, y: this.actionBoundaries.y},
            ptIndex;
        ctx.moveTo(pts[0].x - offsetPt.x, pts[0].y - offsetPt.y);
        for (ptIndex = 1; ptIndex < pts.length; ptIndex = ptIndex + 1) {
            var point = pts[ptIndex];
            ctx.lineTo(point.x - offsetPt.x, point.y - offsetPt.y);
        }
        ctx.lineTo(pts[0].x - offsetPt.x, pts[0].y - offsetPt.y);
        ctx.stroke();
        ctx.closePath();
        ctx.fillStyle = color;
        ctx.fill();
        this.element.appendChild(canvasElem);
        canvasElem.style.width = "100%";
        canvasElem.style.height = "100%";
    };
    
    b.freeformAction.prototype.showMarker = function (points, baseElement) {
        
        var element = document.createElement("div"),
            point1 = points[0],
            ptIndex;
        void 0;
        points = zipPoints(points, 0.15);
        void 0;
        
        element.setAttribute("id", "freeform-marker");
        
        //if this.actionBoundaries not there get them from points and set them
        if (!this.actionBoundaries || this.actionBoundaries.width === 0) {
            this.actionBoundaries = getActionBoundaries(points);
        }
        
        element.style.width = this.actionBoundaries.width + "px";
        element.style.height = this.actionBoundaries.height + "px";
        element.style.zIndex = "2";
        
        this.size = this.actionBoundaries.width * this.actionBoundaries.height;
        
        for (ptIndex = 1; ptIndex < points.length; ptIndex = ptIndex + 1) {
            var point2 = points[ptIndex],
                lineElem = document.createElement("hr"),
                xdiff = point2.x - point1.x,
                ydiff = point2.y - point1.y,
                length = Math.sqrt(xdiff*xdiff + ydiff*ydiff),
                angle = Math.atan2((point2.y - point1.y),(point2.x - point1.x))*180/Math.PI,
                scaleParam = "";
            lineElem.style.borderColor = "#00ff00";
            lineElem.style.borderWidth = "2px";
            lineElem.style.width = length * 100 / (this.actionBoundaries.width) + "%";
            lineElem.style.height = "0px";
            lineElem.style.position = "absolute";
            lineElem.style.top = (point1.y - this.actionBoundaries.y) * 100 / this.actionBoundaries.height + "%";
            lineElem.style.left = (point1.x - this.actionBoundaries.x) * 100 / this.actionBoundaries.width + "%";
            lineElem.style.margin = "0px";
            lineElem.style.transformOrigin = "left center";
            lineElem.setAttribute("noshade", "");
            lineElem.style.transform = "rotate(" + angle + "deg)" + scaleParam;
            element.appendChild(lineElem);
            point1 = points[ptIndex];
        }

        //set reference to this.element
        this.element = element;

        this.element.style.position = "absolute";
        this.element.style.top = this.actionBoundaries.y + "px";
        this.element.style.left = this.actionBoundaries.x + "px";
        
        this.element.style.pointerEvents = "none";
        
        baseElement.appendChild(this.element);
    };
    
    b.freeformAction.prototype.setUpHandler = function (upHandler) {
        this.upHandler = upHandler;
    };
    
    b.freeformAction.prototype.deleteMarker = function () {
        this.element.parentNode.removeChild(this.element);
    };
    
} (DrawingBoard));