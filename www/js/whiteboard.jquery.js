/**
 * HTML5 Canvas Whiteboard
 * 
 * Authors:
 * Antti Hukkanen
 * Kristoffer Snabb
 * 
 * Aalto University School of Science and Technology
 * Course: T-111.2350 Multimediatekniikka / Multimedia Technology
 * 
 * Under MIT Licence
 * 
 */

(function() {
	
/* === BEGIN Fixes ===*/
if (window.loadFirebugConsole) {
	window.loadFirebugConsole();
} else {
	if (!window.console) {
		window.console = {};
		window.console.info = alert;
		window.console.log = alert;
		window.console.warn = alert;
		window.console.error = alert;
	}
}
/* === END Fixes ===*/
	
/**
 * =============
 *     MODEL
 * =============
 */

/* === BEGIN Event objects === */

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
/* === END Event objects === */


	
/**
 * ====================
 *    STATIC CONTROL
 * ====================   
 */
window.Whiteboard = {
	
	context: null,
	canvasElement: null,
	canvas: null,
	type: '',
	coordinates: [0,0],
	events: [],
	eventind: 0,
	
	
	init: function(canvasElement) {
		
		// set the canvas width and height
		// the offsetWidth and Height is default width and height
		this.canvasElement = canvasElement;
		this.canvas = document.getElementById(canvasElement.attr("id"));
		this.canvas.width = this.canvas.offsetWidth;
		this.canvas.height = this.canvas.offsetHeight;
		
		//console.log(this.canvas);
		this.context = this.canvas.getContext('2d');
		
		//initial values for the drawing context
		this.context.lineWidth = 5;
		this.context.lineCap = "round";
		var zoomFactor = 1.0;
	},
	
	execute: function(wbevent, firstexecute) {
	    var type = wbevent.type;
	    //console.log(type);
	    // do this for every event
	    if(firstexecute || firstexecute === undefined) {
	        wbevent.time = new Date().getTime();
	        this.events.push(wbevent);
	        //console.log("firstexecute");
	    }
	    
	    if(type === "beginpath") {
	        this.context.beginPath();
	        this.context.moveTo(wbevent.coordinates[0],
	                       wbevent.coordinates[1]);
	        this.context.stroke();
	    } else if (type === "drawpathtopoint") {  
	        this.context.lineTo(wbevent.coordinates[0],
	                       wbevent.coordinates[1]);
	        this.context.stroke();     
	    } else if (type === "closepath") {
	        this.context.closePath();
	    } else if(type === "strokestyle") {
	        this.context.strokeStyle = wbevent.color;
	    } else if(type === "zoom") {
	        var newWidth = this.canvas.offsetWidth * wbevent.factor;
	        var newHeight = this.canvas.offsetHeight * wbevent.factor;
	        this.canvas.style.width = newWidth + "px";
	        this.canvas.style.height = newHeight + "px";
	    } else if(type === "rotate") {
	        var radian = (wbevent.angle * Math.PI * 2)/360;
	        this.context.rotate(radian);
	    } else if (type === "erase") {
	        this.context.clearRect(wbevent.coordinates[0],
	                          wbevent.coordinates[0],
	                          wbevent.width,
	                          wbevent.height);
	    }
	},
	
	getX: function(event) {
		var cssx = (event.clientX - this.canvasElement.offset().left);
	    var xrel = this.canvas.width/this.canvas.offsetWidth;
	    var canvasx = cssx * xrel;
	    return canvasx;
	},
	
	getY: function(event) {
	    var cssy = (event.clientY - this.canvasElement.offset().top);
	    var yrel = this.canvas.height/this.canvas.offsetHeight;
	    var canvasy = cssy * yrel;
	    return canvasy;
	},
	
	/**
	 * BEGIN ACTIONS
	 */
	animate: function() {
		Whiteboard.context.clearRect(0,0,Whiteboard.canvas.width,Whiteboard.canvas.height);
		Whiteboard.animatenext();
	},
	
	animatenext: function() {
	    if(Whiteboard.eventind === 0) {
	        Whiteboard.execute(Whiteboard.events[0]);
	        Whiteboard.eventind++;   
	    }
	    var now = new Date().getTime();
	    
	    var dtime = Whiteboard.events[Whiteboard.eventind+1].time - Whiteboard.events[Whiteboard.eventind].time;
	    Whiteboard.execute(Whiteboard.events[Whiteboard.eventind]);
	    
	    if (Whiteboard.eventind < Whiteboard.events.length - 1) {
	        setTimeout(Whiteboard.animatenext, dtime);
	    }
	    Whiteboard.eventind++;
	},
	
	activatePencil: function() {
		Whiteboard.canvasElement.bind("mousedown", Whiteboard.beginPencilDraw);
	},

	beginPencilDraw: function(event) {
	    var e = new BeginPath(Whiteboard.getX(event),Whiteboard.getY(event));
	    Whiteboard.execute(e);
	    Whiteboard.canvasElement.bind("mousemove", Whiteboard.pencilDraw);
	    Whiteboard.canvasElement.bind("mouseup", Whiteboard.endPencilDraw);
	    Whiteboard.canvasElement.bind("mouseout", Whiteboard.endPencilDraw);
	},

	pencilDraw: function(event) {
	    var e = new DrawPathToPoint(Whiteboard.getX(event),Whiteboard.getY(event));
	    Whiteboard.execute(e);
	},
	
	endPencilDraw: function (event) {
		Whiteboard.canvasElement.unbind();
	},
	
	activateEraser: function() {
		Whiteboard.canvasElement.bind("mousedown", Whiteboard.beginErasing);
	},

	beginErasing: function(event) {
	    var e = new BeginPath(Whiteboard.getX(event),Whiteboard.getY(event));
	    Whiteboard.execute(e);
	    Whiteboard.canvasElement.bind("mousemove", Whiteboard.erasePoint);
	    Whiteboard.canvasElement.bind("mouseup", Whiteboard.endErasing);
	    Whiteboard.canvasElement.bind("mouseout", Whiteboard.endErasing);
	},
	
	erasePoint: function(event) {
	    var e = new Erase(Whiteboard.getX(event),Whiteboard.getY(event));
	    Whiteboard.execute(e);
	},
	
	endErasing: function(event) {
		Whiteboard.canvasElement.unbind();
	},
	
	setStrokeStyle: function(color) {
	    var e = new StrokeStyle(color);
	    Whiteboard.execute(e);
	},

	zoomin: function() {
	    var e = new Zoom(1.5);
	    Whiteboard.execute(e);
	},

	zoomout: function() {
	    var e = new Zoom(0.5);
	    Whiteboard.execute(e);
	},

	rotate: function(degree) {
	    var e = new Rotate(degree);
	    Whiteboard.execute(e);
	}
	
};

/**
 * ======================
 *    JQUERY FUNCTIONS
 * ======================   
 */
/**
 * JQuery functioita voi lisätä näin. Tätä funktiota voisi nyt
 * kutsua mille tahansa elementille.
 * Esim:
 * $("#canvas").funktio(arvo);
 */
jQuery.fn.funktio = function(value) {
	// TODO
};

/* === END === */
})();
