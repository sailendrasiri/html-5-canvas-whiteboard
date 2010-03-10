

var canvas = document.getElementById("canvas");
console.log(canvas);
var context = canvas.getContext('2d');

//initial values for the drawing context
context.lineWidth = 5;
context.lineCap = "round";



/*
This function handles the onmousedow event on the polygon
draw button
*/
function drawPolyline() {
    console.log("draw polyline begin");
    context.beginPath();
    $("#canvas").bind("mousedown", addPointToPath);
}

function addPointToPath(event) {
    console.log("add point to path");
    console.log(event.clientY);
    console.log(event.clientX);
    console.log(event.target.offsetTop);
    console.log(event.target.offsetLeft);
}





