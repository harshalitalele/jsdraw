function showMsg() {
    var msg = document.getElementById("msg").value;
    alert(msg);
}

function initiateDrawing() {
    console.log("drawing has been initiated...");
    var b1 = new DrawingBoard();
    console.log("b1: " + JSON.stringify(b1));
}