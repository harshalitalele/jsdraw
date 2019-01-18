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
        toolboxStyles: {}
    };
    
    b.Board = function(options) {
        this.options = options || defaultOptions;
        //To Do: Remove all extra options if there from options by comparing with defaultOptions object
        this.currentDrawStyle = null;
        //To Do: Check if we need below 2 properties
        this.saveHandler = this.options.saveHandler;
        this.clearAllHandler = this.options.clearAllHandler;
        this.toolbox = new b.Toolbox();
    }
}(DrawingBoard));
