

//set the canvas width and height
// the offsetWidth and Height is default width and height
var canvas = document.getElementById("canvas");
canvas.width = canvas.offsetWidth;
canvas.height = canvas.offsetHeight;

console.log(canvas);
var context = canvas.getContext('2d');

//initial values for the drawing context
context.lineWidth = 5;
context.lineCap = "round";
var zoomFactor = 1.0;


/*
Help function to get the x coordinate inside canvas
counted from the left 
*/
function getX(event) {
    var cssx = (event.clientX - $("#canvas").offset().left);
    var xrel = canvas.width/canvas.offsetWidth;
    var canvasx = cssx * xrel;
    console.log(canvasx);
    return canvasx;
}
/*
Help function to get the y coordinate inside canvas
counted from the top 
*/
function getY(event) {
    var cssy = (event.clientY - $("#canvas").offset().top);
    var yrel = canvas.height/canvas.offsetHeight;
    var canvasy = cssy * yrel;
    console.log(canvasy);
    return canvasy;
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

/*
set the strokestyle with this function
*/
function setStrokeStyle(color) {
    console.log("set stroke style");
    console.log(color);
    context.strokeStyle = color;
}

//global value to remember the previous color when eraser activated
var previousStrokeStyle = context.strokeStyle;
/*
This function deactivates the eraser
*/
function deactivateEraser(event) {
    console.log("deactivate eraser");
    context.strokeStyle = previousStrokeStyle;
    $("#canvas").unbind();
}

/*
This function activates the eraser function..
at the moment it only draw a white line on top
of the other graphics
*/
function activateEraser() {
    previousStrokeStyle = context.strokesStyle;
    context.strokeStyle = "#FFFFFF";
    drawPolyline();
}

/*
This function scales so that it will have a 
zoom in effect with the given factor
*/
function zoom(factor) {
    console.log("zoomin");
    //context.scale(factor,factor);
    var newWidth = canvas.offsetWidth * factor;
    var newHeight = canvas.offsetHeight * factor;
    canvas.style.width = newWidth + "px";
    canvas.style.height = newHeight + "px";
    console.log(factor);
    console.log(canvas.width);
    console.log(canvas.offsetWidth);
    console.log(newWidth);
}
