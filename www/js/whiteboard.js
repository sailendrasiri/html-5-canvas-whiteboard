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
	
/**
 * =============
 *     MODEL
 * =============
 */

/* === BEGIN Event objects === */

/* Begin path event */
function BeginPath(x, y) {
    this.coordinates = [x, y];
    this.type="beginpath";
}
/* Begin shape event */
function BeginShape(x, y, canvas) {
	this.type = "beginshape";
	this.canvas = canvas;
	this.coordinates = [x, y];
	this.time = new Date().getTime();
}
/* End path event */
function ClosePath() {
    this.type = "closepath";
}
/* Point draw event */
function DrawPathToPoint(x, y) {
    this.type = "drawpathtopoint";
    this.coordinates = [x, y];
    this.time = new Date().getTime();
}
/*Erase event */
function Erase(x, y) {
    this.type = "erase";
    this.coordinates = [x, y];
    this.height = 5;
    this.width = 5;
    this.time = new Date().getTime();
}
/* Rectangle event */
function Rectangle(sx, sy, ex, ey, canvas) {
	this.type = "rectangle";
	this.coordinates = [sx, sy, ex, ey];
	this.canvas = canvas;
	this.time = new Date().getTime();
}
function Oval(x, y, w, h, canvas) {
	this.type = "oval";
	this.coordinates = [x, y, w, h];
	this.canvas = canvas;
	this.time = new Date().getTime();
}
/* Storke style event */
function StrokeStyle(color) {
    this.type = "strokestyle";
    this.color = color;
    this.time = new Date().getTime();
}
/* Zoom event */
function Zoom(factor) {
    this.type = "zoom";
    this.factor = factor;
    this.time = new Date().getTime();
}
function Restore(canvas) {
	this.type = "restore";
	if (canvas !== undefined) {
		this.canvas = canvas;
	}
	this.time = new Date().getTime();
}
/* Rotate event
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
	canvas: null,
	type: '',
	coordinates: [0,0],
	events: [],
	animationind: 0,
	
	drawColor: '#000000',
	
	
	init: function(canvasid) {
		// set the canvas width and height
		// the offsetWidth and Height is default width and height
		this.canvas = document.getElementById(canvasid);
		this.canvas.width = this.canvas.offsetWidth;
		this.canvas.height = this.canvas.offsetHeight;
		
		//console.log(this.canvas);
		this.context = this.canvas.getContext('2d');
		
		//initial values for the drawing context
		this.context.lineWidth = 5;
		this.context.lineCap = "round";
		var zoomFactor = 1.0;
		
		// Initialize the selected color
		var col = this.drawColor;
		this.drawColor = null;
		this.setStrokeStyle(col);
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
	    } else if(type === "beginshape") {
	    	this.context.save();
	    	this.context.beginPath();
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
	    } else if (type === "restore") {
	        var wid = this.canvas.width;
	        var hei = this.canvas.height;
	    	this.context.clearRect(0, 0, wid, hei);
	    	if (wbevent.canvas !== undefined) {
	    		this.context.drawImage(wbevent.canvas, 0, 0);
	    	}
	    } else if(type === "rotate") {
	        var radian = wbevent.angle * Math.PI / 180;
	        var wid = this.canvas.width;
	        var hei = this.canvas.height;
	        
	        var tmp = document.createElement("canvas");
	        var tmpcnv = tmp.getContext('2d');
	        tmp.width = wid;
	        tmp.height = hei;
	        tmpcnv.drawImage(this.canvas, 0, 0);
	        
	        // TODO: Fix: the image blurs out after multiple rotations 
	        this.context.save();
	        this.context.clearRect(0, 0, wid, hei);
	        this.context.translate(wid/2,hei/2);
	        this.context.rotate(radian);
	        this.context.translate(-wid/2,-hei/2);
	        this.context.drawImage(tmp, 0, 0);
	        this.context.restore();
	        
	        tmp = tmpcnv = undefined;
	    } else if (type === "erase") {
	        this.context.clearRect(wbevent.coordinates[0],
	                          wbevent.coordinates[1],
	                          wbevent.width,
	                          wbevent.height);
	    } else if (type === "rectangle") {
	    	var sx = wbevent.coordinates[0];
	    	var sy = wbevent.coordinates[1];
	    	var ex = wbevent.coordinates[2];
	    	var ey = wbevent.coordinates[3];
	    	var tmp = 0;
	    	if (ex < sx) {
	    		tmp = sx;
	    		sx = ex;
	    		ex = tmp;
	    	}
	    	if (ey < sy) {
	    		tmp = sy;
	    		sy = ey;
	    		ey = tmp;
	    	}
	    	
	    	if (wbevent.canvas !== undefined) {
		        var wid = this.canvas.width;
		        var hei = this.canvas.height;
	    		this.context.clearRect(0, 0, wid, hei);
	    		this.context.drawImage(wbevent.canvas, 0, 0);
	    	}
	    	this.context.beginPath();
	    	this.context.rect(sx, sy, ex-sx, ey-sy);
	    	this.context.closePath();
	    	this.context.stroke();
	    } else if (type === "oval") {
	    	var x = wbevent.coordinates[0];
	    	var y = wbevent.coordinates[1];
	    	var w = wbevent.coordinates[2];
	    	var h = wbevent.coordinates[3];
	    	
	    	var kappa = 0.5522848;
	    	var ox = (w / 2) * kappa;
	    	var oy = (h / 2) * kappa;
	    	var xe = x + w;
	    	var ye = y + h;
	    	var xm = x + w / 2;
	    	var ym = y + h / 2;
	    	
	    	if (wbevent.canvas !== undefined) {
		        var wid = this.canvas.width;
		        var hei = this.canvas.height;
	    		this.context.clearRect(0, 0, wid, hei);
	    		this.context.drawImage(wbevent.canvas, 0, 0);
	    	}
	    	
	    	this.context.beginPath();
	    	this.context.moveTo(x, ym);
	    	this.context.bezierCurveTo(x, ym - oy, xm - ox, y, xm, y);
	    	this.context.bezierCurveTo(xm + ox, y, xe, ym - oy, xe, ym);
	    	this.context.bezierCurveTo(xe, ym + oy, xm + ox, ye, xm, ye);
	    	this.context.bezierCurveTo(xm - ox, ye, x, ym + oy, x, ym);
	    	this.context.closePath();
	    	this.context.stroke();
	    }
	},
	
	getRelative: function() {
		return {width: this.canvas.width/this.canvas.offsetWidth,
				height: this.canvas.height/this.canvas.offsetHeight};
	},
	
	
	/* === BEGIN ACTIONS === */
	
	animate: function() {
		Whiteboard.animationind = 0;
		Whiteboard.context.clearRect(0,0,Whiteboard.canvas.width,Whiteboard.canvas.height);
		Whiteboard.animatenext();
	},
	
	animatenext: function() {
	    if(Whiteboard.animationind === 0) {
	        Whiteboard.execute(Whiteboard.events[0], false);
	        Whiteboard.animationind++;   
	    }
	    
	    Whiteboard.execute(Whiteboard.events[Whiteboard.animationind], false);
	    Whiteboard.animationind++;
	    
	    if (Whiteboard.animationind < Whiteboard.events.length - 1) {
	    	var now = new Date().getTime();
		    var dtime = Whiteboard.events[Whiteboard.animationind+1].time - Whiteboard.events[Whiteboard.animationind].time;
	        setTimeout(Whiteboard.animatenext, dtime);
	    }
	},
	
	beginPencilDraw: function(x, y) {
	    var e = new BeginPath(x, y);
	    Whiteboard.execute(e);
	},
	
	pencilDraw: function(x, y) {
	    var e = new DrawPathToPoint(x, y);
	    Whiteboard.execute(e);
	},
	
	beginErasing: function(x, y) {
	    var e = new BeginPath(x, y);
	    Whiteboard.execute(e);
	},
	
	erasePoint: function(x, y) {
	    var e = new Erase(x, y);
	    Whiteboard.execute(e);
	},
	
	beginShape: function(x, y) {
        var tmp = document.createElement("canvas");
        var tmpcnv = tmp.getContext('2d');
        tmp.width = Whiteboard.canvas.width;
        tmp.height = Whiteboard.canvas.height;
        tmpcnv.drawImage(Whiteboard.canvas, 0, 0);
		var e = new BeginShape(x, y, tmp);
		Whiteboard.execute(e);
	},
	
	drawRectangle: function(x, y) {
		var i = Whiteboard.events.length - 1;
		while (i >= 0) {
			var e = Whiteboard.events[i];
			if (e.type === "beginshape") {
				var ev = new Rectangle(e.coordinates[0], e.coordinates[1], x, y, e.canvas);
				Whiteboard.execute(ev);
				e = ev = undefined;
				break;
			}
			i--;
		}
	},
	
	drawOval: function(x, y) {
		var i = Whiteboard.events.length - 1;
		while (i >= 0) {
			var e = Whiteboard.events[i];
			if (e.type === "beginshape") {
				var sx = e.coordinates[0];
				var sy = e.coordinates[1];
				var wid = x-sx;
				var hei = y-sy;
				
				var ev = new Oval(sx, sy, wid, hei, e.canvas);
				Whiteboard.execute(ev);
				e = ev = undefined;
				break;
			}
			i--;
		}
	},
	
	setStrokeStyle: function(color) {
		if (color != Whiteboard.drawColor) {
			var e = new StrokeStyle(color);
			Whiteboard.execute(e);
		}
	},
	
	zoomin: function() {
	    var e = new Zoom(1.5);
	    Whiteboard.execute(e);
	},

	zoomout: function() {
	    var e = new Zoom(0.5);
	    Whiteboard.execute(e);
	},
	
	zoom: function(factor) {
	    var e = new Zoom(factor);
	    Whiteboard.execute(e);
	},

	rotate: function(degree) {
	    var e = new Rotate(degree);
	    Whiteboard.execute(e);
	},
	
	/*
	This function redraws the entire canvas according to the events in events
	*/
	redraw: function() {
		Whiteboard.context.clearRect(0,0,Whiteboard.canvas.width,Whiteboard.canvas.height);
	    var redrawEvents = this.events;
	    this.events = [];
	    var i;
	    for(i=0;i < redrawEvents.length; i++) {
	        if(i === 0) {
	            this.execute(redrawEvents[i]);
	        } else {
	            this.execute(redrawEvents[i]);
	        }
	    }
	},
	
	/*
	This removes the last event from this events and redraws
	(it can be made more effective then to redraw but time is limited)
	*/
	undo: function() {
	    console.log("undo");
	    reverseEvent = this.events.pop();
	    console.log(reverseEvent.type);
	    if(reverseEvent.type === '') {
	    }
	    this.redraw();
	}
	
	/* === END ACTIONS === */

};

})();
