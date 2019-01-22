var annoBoard = new Annotation("drawing-board");

function showMsg() {
    var msg = document.getElementById("msg").value;
    alert(msg);
}

function initiateDrawing() {
    console.log("drawing has been initiated...");
    var b1 = new DrawingBoard();
        //b2 = new DrawingBoard({html: 'test'});
    console.log("b1: " + JSON.stringify(b1));
    //console.log("b2: " + JSON.stringify(b2));
    //annoBoard.drawAnnotation();
}