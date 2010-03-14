

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

/*Model*/

/*
Event objects
*/

/*Begin path event*/
function BeginPath(x,y) {
    this.coordinates = [x,y];
    this.type="beginpath";
}
/*End path event*/
function ClosePath() {
    this.type = "closepath";
}
/*Point draw event*/
function DrawPathToPoint(x, y) {
    this.type = "drawpathtopoint";
    this.coordinates = [x, y];
    this.time = new Date().getTime();
}
/*Erase event */
function Erase(x,y) {
    this.type = "erase";
    this.coordinates = [x,y];
    this.time = new Date().getTime();
}
/*Storke style event */
function StrokeStyle(color) {
    this.type = "strokestyle";
    this.color = color;
    this.time = new Date().getTime();
}
/*Zoom event*/
function Zoom(factor) {
    this.type = "zoom";
    this.factor = factor;
    this.time = new Date().getTime();
}
/*Rotate event
angle in degrees
*/
function Rotate(angle) {
    this.type = "rotate";
    this.angle = angle;
    this.time = new Date().getTime();
}

/*
The playback function requires events with timestamps

all events will be added to the events array

*/
var events = [];


/* Control */

/*
This function executes the any Whiteboard event
*/
function execute(wbevent) {
    var type = wbevent.type;
    
    // do this for every event
    wbevent.time = new Date().getTime();
    events.push(wbevent);
    
    if(type === "beginpath") {
        context.beginPath();
        context.moveTo(wbevent.coordinates[0],
                       wbevent.coordinates[1]);
        context.stroke();
    } else if (type === "drawpathtopoint") {  
        context.lineTo(getX(event),getY(event));
        context.stroke();     
    } else if (type === "closepath") {
        context.closePath();
    } else if(type === "strokestyle") {
        context.strokeStyle = wbevent.color;
    } else if(type === "zoom") {
        var newWidth = canvas.offsetWidth * wbevent.factor;
        var newHeight = canvas.offsetHeight * wbevent.factor;
        canvas.style.width = newWidth + "px";
        canvas.style.height = newHeight + "px";
    } else if(type === "rotate") {
        var radian = (wbevent.angle * Math.PI * 2)/360;
        console.log(radian);
        context.rotate(radian);
    }
}

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
The pencil function is defined with the following functions
*/
function activatePencil() {
    console.log("pencil activated");
    $("#canvas").bind("mousedown", beginPencilDraw);
}

function beginPencilDraw(event) {
    console.log("begin pencil draw");
    var e = new BeginPath(getX(event),getY(event));
    console.log(e);
    execute(e);
    $("#canvas").bind("mousemove", pencilDraw);
    $("#canvas").bind("mouseup", endPencilDraw);
    $("#canvas").bind("mouseout", endPencilDraw);
}

function pencilDraw(event) {
    console.log("pencil draw");
    var e = new DrawPathToPoint(getX(event),getY(event));
    console.log(e);
    execute(e);
}
function endPencilDraw(event) {
    console.log("end pencile draw");
    $("#canvas").unbind();
}

/*
set the strokestyle with this function
*/
function setStrokeStyle(color) {
    console.log("set stroke style");
    var e = new StrokeStyle(color);
    execute(e);
}

/*
zoomin and zoomout functions
*/
function zoomin() {
    var e = new Zoom(1.5);
    execute(e);
}

function zoomout() {
    var e = new Zoom(0.5);
    execute(e);
}

/*
function that rotates the canvas
*/
function rotate(degree) {
    var e = new Rotate(degree);
    execute(e);
}

