

var canvas = document.getElementById("canvas");
console.log(canvas);
var context = canvas.getContext('2d');

//initial values for the drawing context
context.lineWidth = 5;
context.lineCap = "round";



/*
This function adds a point to the polyline 
that is beeing drawn
*/
function addPointToPolyline(event) {
    console.log("add point to path");
    context.lineTo(event.layerX,event.layerY);
    context.stroke();
}

/*
This function stops the polyline drawing
*/
function endPolylineDraw(event) {
    console.log("end polyline draw");
    $("#canvas").unbind();
}

/*
This function is called
on mousedown when the polyline draw
is chosen.
*/
function beginPolylineDraw(event) {
    console.log("begin polyline draw");
    context.moveTo(event.layerX,event.layerY);
    $("#canvas").bind("mousemove", addPointToPolyline);
    $("#canvas").bind("mouseup", endPolylineDraw);
    $("#canvas").bind("mouseout", endPolylineDraw);
}

/*
This function handles the onmousedow event on the polygon
draw button
*/
function drawPolyline() {
    console.log("draw polyline begin");
    context.beginPath();
    $("#canvas").bind("mousedown", beginPolylineDraw);
}






