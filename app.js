function showUseCases() {
    var usecaseVisibility = document.getElementById("exampleUseCases").style;
    if(usecaseVisibility.display == "none") {
        usecaseVisibility.display = "block";
    } else {
        usecaseVisibility.display = "none";
    }
}

var myboard = new DrawingBoard({
    saveHandler: function(data) {
        alert(JSON.stringify(data));
    }
});
