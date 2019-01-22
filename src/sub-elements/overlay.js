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
        console.log("overlay created for " + b);
        this.canvas = createOverlay(elemProp);
    };
    
    b.Overlay.prototype.show = function() {
        this.canvas.style.display = "block";
    }
    
    b.Overlay.prototype.hide = function() {
        this.canvas.style.display = "none";
    }
} (DrawingBoard));