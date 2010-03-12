

var canvas = document.getElementById("canvas");
canvas.width = 700;
canvas.height = 400;
console.log(canvas);
var context = canvas.getContext('2d');

//initial values for the drawing context
context.lineWidth = 5;
context.lineCap = "round";


/*
Help function to get the x coordinate inside canvas
counted from the left 
*/
function getX(event) {
    console.log("get x coordinate");
    return (event.clientX - $("#canvas").offset().left);
}
/*
Help function to get the y coordinate inside canvas
counted from the top 
*/
function getY(event) {
    console.log("get y coordinate");
    return (event.clientY - $("#canvas").offset().top);
}


/*
This function adds a point to the polyline 
that is beeing drawn
*/
function addPointToPolyline(event) {
    console.log("add point to path");
    context.lineTo(getX(event),getY(event));
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
    context.moveTo(getX(event),getY(event));
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






