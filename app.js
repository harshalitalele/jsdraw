var annoBoard = new Annotation("drawing-board");

function showMsg() {
    var msg = document.getElementById("msg").value;
    alert(msg);
}

function initiateDrawing() {
    console.log("drawing has been initiated...");
    annoBoard.drawAnnotation();
}