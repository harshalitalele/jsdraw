function DrawingBoard() {
    return new DrawingBoard.Board();
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
        overlay.style.width = parentRect.width + "px";
        overlay.style.height = parentRect.height + "px";
        overlay.style.position = "absolute";
        overlay.style.top = 0;
        overlay.style.left = 0;
        element.appendChild(overlay);
        return overlay;
    }
    
    b.Board = function(options) {
        this.options = options || defaultOptions;
        //To Do: Remove all extra options if there from options by comparing with defaultOptions object
        this.currentDrawStyle = null;
        //To Do: Check if we need below 2 properties
        this.saveHandler = this.options.saveHandler;
        this.clearAllHandler = this.options.clearAllHandler;
        this.toolbox = new b.Toolbox();
        this.showToolbox = function() {
            //
        };
        this.hideToolbox = function() {
            //
        };
        this.canvas = createOverlay(this.options.elemProp);
        
    }
}(DrawingBoard));
