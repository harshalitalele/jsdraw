(function (ann) {
    "use strict";
    
    function createCanvasOverlay(element) {
        var canvasElem = document.createElement("canvas"),
            baseElementId = element.getAttribute("id");
        canvasElem.id = "canvas-overlay";
        canvasElem.style.position = "absolute";
        canvasElem.style.top = "0px";
        canvasElem.style.left = "0px";
        canvasElem.style.width = "100%";
        canvasElem.style.height = "100%";
        canvasElem.style.zIndex = "9999";
        return canvasElem;
    }
    
    ann.AnnoBoard = function (elemId) {
        var selfBoard = this,
            canvasElement;
        this.id = elemId;
        this.parentElem = document.getElementById(this.id);
        
        canvasElement = createCanvasOverlay(this.parentElem);
        
        this.parentElem.style.position = "relative";
        this.parentElem.appendChild(canvasElement);
        
        this.overlayElem = canvasElement;
        
        this.actions = new ann.actions(this.overlayElem);
        this.actions.attachActions();
        
        this.hideOverlay();
        this.implementedAction = null;
    };
    
    
    ann.AnnoBoard.prototype.getAnnotations = function () {
        return this.annotations;
    };
    
    ann.AnnoBoard.prototype.drawAnnotation = function (annotationType) {
        this.showOverlay();
        this.implementedAction = new ann.newFreeformAction();
        this.actions.setBehavior(this.implementedAction);
    };
    
    ann.AnnoBoard.prototype.getOverlay = function () {
        return this.overlayElem;
    };
    
    ann.AnnoBoard.prototype.showOverlay = function () {
        var context = this.overlayElem.getContext("2d");
        context.clearRect(0, 0, context.canvas.width, context.canvas.height);
        this.overlayElem.style.display = "block";
    };
    
    //To Do: should hideOverlay belong to this or should that be private function?
    ann.AnnoBoard.prototype.hideOverlay = function () {
        this.overlayElem.style.display = "none";
    };
        
    ann.AnnoBoard.prototype.destroyBoard = function () {
        this.parentElem.removeEventListener("onAnnotationSave", this.saveAnnotation);
        delete this.saveAnnotation;
        this.parentElem.removeEventListener("onAnnotationDelete", this.deleteAnnotation);
        delete this.deleteAnnotationOnOsd;
        this.parentElem.removeEventListener("onAnnotationEdit", this.editAnnotationOnOsd);
        delete this.editAnnotationOnOsd;
        if (this.overlayElem.parentNode) {
            this.overlayElem.parentNode.removeChild(this.overlayElem);
        } else {
            delete this.overlayElem;
        }
    };
    
}(Annotation));
