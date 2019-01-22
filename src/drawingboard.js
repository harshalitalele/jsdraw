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
                    alert(JSON.stringify(markers));
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
