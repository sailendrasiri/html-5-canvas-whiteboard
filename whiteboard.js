

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
    this.height = 5;
    this.width = 5;
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

firstexecute is a boolean value that tells the function to
save the event or to execute it without saving. default is true
*/
function execute(wbevent, firstexecute) {
    var type = wbevent.type;
    //console.log(type);
    // do this for every event
    if(firstexecute || firstexecute === undefined) {
        wbevent.time = new Date().getTime();
        events.push(wbevent);
        console.log("firstexecute");
    }
    
    if(type === "beginpath") {
        context.beginPath();
        context.moveTo(wbevent.coordinates[0],
                       wbevent.coordinates[1]);
        context.stroke();
    } else if (type === "drawpathtopoint") {  
        context.lineTo(wbevent.coordinates[0],
                       wbevent.coordinates[1]);
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
        context.rotate(radian);
    } else if (type === "erase") {
        context.clearRect(wbevent.coordinates[0],
                          wbevent.coordinates[0],
                          wbevent.width,
                          wbevent.height);
    }
}

/*
Animate from the beginning
*/

function animate() {
    context.clearRect(0,0,canvas.width,canvas.height);
    animatenext();
}

var eventind = 0;

function animatenext() {
    if(eventind === 0) {
        execute(events[0]);
        eventind++;   
    } else if (eventind >= events.length - 1) {
        return 0;
    }
    now = new Date().getTime();
    
    var dtime = events[eventind+1].time - events[eventind].time;
    execute(events[eventind]);
    setTimeout("animatenext()", dtime);
    eventind++;
}


/*
Help function to get the x coordinate inside canvas
counted from the left 
*/
function getX(event) {
    var cssx = (event.clientX - $("#canvas").offset().left);
    var xrel = canvas.width/canvas.offsetWidth;
    var canvasx = cssx * xrel;
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
    return canvasy;
}

/*
The pencil function is defined with the following functions
*/
function activatePencil() {
    $("#canvas").bind("mousedown", beginPencilDraw);
}

function beginPencilDraw(event) {
    var e = new BeginPath(getX(event),getY(event));
    execute(e);
    $("#canvas").bind("mousemove", pencilDraw);
    $("#canvas").bind("mouseup", endPencilDraw);
    $("#canvas").bind("mouseout", endPencilDraw);
}

function pencilDraw(event) {
    var e = new DrawPathToPoint(getX(event),getY(event));
    execute(e);
}
function endPencilDraw(event) {
    $("#canvas").unbind();
}

/*
Eraser functions below 
*/
function activateEraser() {
    $("#canvas").bind("mousedown", beginErasing);
}

function beginErasing(event) {
    var e = new BeginPath(getX(event),getY(event));
    execute(e);
    $("#canvas").bind("mousemove", erasePoint);
    $("#canvas").bind("mouseup", endErasing);
    $("#canvas").bind("mouseout", endErasing);
}
function erasePoint(event) {
    var e = new Erase(getX(event),getY(event));
    execute(e);
}
function endErasing(event) {
    $("#canvas").unbind();
}


/*
set the strokestyle with this function
*/
function setStrokeStyle(color) {
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

