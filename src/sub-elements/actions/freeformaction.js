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
        console.log("Points before " + points.length);
        points = zipPoints(points, 0.15);
        console.log("Now reduced to " + points.length);
        
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