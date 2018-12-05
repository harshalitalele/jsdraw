(function (ann) {
    "use strict";
    var actionCompleted = true;
    
    function getSlope(p1, p2) {
        return (p2.y-p1.y)/(p2.x-p1.x);
    }
    
    function zipPoints(points, tolerance) {
        tolerance = 0.05;
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
    
    ann.newFreeformAction = function (annotation, actionBoundaries) {
        this.type = "New Freeform";
        this.color = "#00ff00";
        this.lineWidth = 4;
        this.points = [];
        this.comment = "";
        Object.assign(this, annotation);
        this.actionBoundaries = actionBoundaries || (this.points && this.points.length > 0 ? getActionBoundaries(this.points) : {x: 0, y: 0, width: 0, height: 0});
        this.element = null;
    };
    
    ann.newFreeformAction.prototype.actionChangeBehavior = function (baseElement, point) {
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
    
    ann.newFreeformAction.prototype.actionCompleteBehavior = function (baseElement, point) {
        var context = baseElement.getContext("2d");
        context.lineTo(point.x, point.y);
        context.stroke();
        context.closePath();
        this.points.push(point);
        updateActionBoundaries(point, this.actionBoundaries);
        
        this.showAnnotation(this.points, baseElement.parentNode);
        
        actionCompleted = true;
    };
    
    ann.newFreeformAction.prototype.showAnnotation = function (points, baseElement) {
        
        var element = document.createElement("div"),
            point1 = points[0],
            ptIndex;
        console.log("Points before " + points.length);
        points = zipPoints(points, 0.15);
        console.log("Now reduced to " + points.length);
        
        element.setAttribute("id", "new-freeform-annotation");
        
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
    
    ann.newFreeformAction.prototype.deleteAnnotation = function () {
        this.element.parentNode.removeChild(this.element);
    };
    
    ann.newFreeformAction.prototype.onSave = function (comment) {
        this.comment = comment;
    };
    
    ann.newFreeformAction.prototype.onCancel = function () {
        this.deleteAnnotation();
    };
    
    ann.newFreeformAction.prototype.getHighlightPosition = function () {
        var annotationPos = this.element.getClientRects()[0],
            annotationContainerPos = this.element.parentElement.getClientRects()[0];
        return {
            x: Math.max(annotationPos.x, annotationContainerPos.x, 0),
            y: Math.max(annotationPos.y, annotationContainerPos.y, 0)
        };
    };
    
}(Annotation));
