function showMsg() {
    var msg = document.getElementById("msg").value;
    alert(msg);
}

var b1 = new DrawingBoard({
    saveHandler: function(data) {
        alert(JSON.stringify(data));
    }
});
