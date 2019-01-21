(function(b) {
    
    var defaultOptions = {
        markers: ["freeform"],
        saveBtn: true,
        clearAllBtn: true
    };
    
    function addMarkers(options, toolbox, onMarkerCreated) {
        for(var m in options) {
            var mType = options[m],
                mElem = document.createElement("div"),
                mStyle = mElem.style;
            mStyle.height = "32px";
            mStyle.width = "32px";
            mStyle.margin = "5px";
            switch(mType) {
                case "freeform":
                    mElem.innerText = "F";
                    mElem.addEventListener("created", function(e) {
                        onMarkerCreated(e);
                    });
                    break;
            }            
            toolbox.appendChild(mElem);
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
        
        function onMarkerCreated(marker) {
            allMarkers.push(marker);
        }
        
        addMarkers(options.markers, toolboxElem, onMarkerCreated);
        
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