/**
 * UI for HTML5 Canvas Whiteboard
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
	
window.WhiteboardUi = {
	
	canvasElement: null, // jQuery element for canvas
	elementConf: {
		pencil: 'pencil_active',
		eraser: 'eraser_active',
		button_pencil: 'button_pencil',
		button_color: 'button_color',
		button_eraser: 'button_eraser',
		button_zoomin: 'button_zoomin',
		button_zoomout: 'button_zoomout',
		button_rotate: 'button_rotate',
		button_animate: 'button_animate',
		input_color: 'color',
		input_rotation: 'rotation',
		
	},
	
	init: function(canvasElement, conf) {
		this.canvasElement = canvasElement;
		Whiteboard.init(canvasElement.attr("id"));
		if (conf !== undefined) {
			for (var i in this.elementConf) {
				if (conf.i !== undefined) {
					this.elementConf.i = conf.i;
				}
			}
		}
		this.addListeners();
	},
	
	getElement: function(ind) {
		return $('#' + WhiteboardUi.elementConf[ind]);
	},
	
	addListeners: function() {
		WhiteboardUi.getElement('button_pencil').mousedown(function() {
			Whiteboard.setStrokeStyle(WhiteboardUi.getElement('input_color').attr("value"));
			WhiteboardUi.activatePencil();
		});
		WhiteboardUi.getElement('button_color').mousedown(function() {
			Whiteboard.setStrokeStyle(WhiteboardUi.getElement('input_color').attr("value"));
		});
		WhiteboardUi.getElement('button_eraser').mousedown(WhiteboardUi.activateEraser);
		WhiteboardUi.getElement('button_zoomin').mousedown(Whiteboard.zoomin);
		WhiteboardUi.getElement('button_zoomout').mousedown(Whiteboard.zoomout);
		WhiteboardUi.getElement('button_rotate').mousedown(function() {
			var rot = parseInt(WhiteboardUi.getElement('input_rotation').attr("value"));
			if (rot >= -360 && rot <= 360) {
				Whiteboard.rotate(rot);
			} else {
				alert("Rotation value between -360 and 360!");
			}
		});
		WhiteboardUi.getElement('button_animate').mousedown(Whiteboard.animate);
	},
	
	getX: function(event) {
		var cssx = (event.clientX - this.canvasElement.offset().left);
	    var xrel = Whiteboard.getRelative().width;
	    var canvasx = cssx * xrel;
	    return canvasx;
	},
	
	getY: function(event) {
	    var cssy = (event.clientY - this.canvasElement.offset().top);
	    var yrel = Whiteboard.getRelative().height;
	    var canvasy = cssy * yrel;
	    return canvasy;
	},
	
	changeTool: function() {
		WhiteboardUi.canvasElement.unbind();
		WhiteboardUi.canvasElement.removeClass(WhiteboardUi.elementConf.pencil);
		WhiteboardUi.canvasElement.removeClass(WhiteboardUi.elementConf.eraser);
	},
	
	activatePencil: function(event) {
		WhiteboardUi.changeTool();
		WhiteboardUi.canvasElement.bind("mousedown", WhiteboardUi.beginPencilDraw);
		WhiteboardUi.canvasElement.addClass(WhiteboardUi.elementConf.pencil);
	},

	beginPencilDraw: function(event) {
	    Whiteboard.beginPencilDraw(WhiteboardUi.getX(event), WhiteboardUi.getY(event));
	    WhiteboardUi.canvasElement.bind("mousemove", function(event) {
	    	Whiteboard.pencilDraw(WhiteboardUi.getX(event), WhiteboardUi.getY(event));
	    });
	    WhiteboardUi.canvasElement.bind("mouseup", WhiteboardUi.endPencilDraw);
	    WhiteboardUi.canvasElement.bind("mouseout", WhiteboardUi.endPencilDraw);
	},
	
	endPencilDraw: function (event) {
		WhiteboardUi.canvasElement.unbind("mousemove");
	},
	
	activateEraser: function(event) {
		WhiteboardUi.changeTool();
		WhiteboardUi.canvasElement.bind("mousedown", WhiteboardUi.beginErasing);
		WhiteboardUi.canvasElement.addClass(WhiteboardUi.elementConf.eraser);
	},

	beginErasing: function(event) {
	    Whiteboard.beginErasing(WhiteboardUi.getX(event), WhiteboardUi.getY(event));
	    WhiteboardUi.canvasElement.bind("mousemove", function(event) {
	    	Whiteboard.erasePoint(WhiteboardUi.getX(event), WhiteboardUi.getY(event));
	    });
	    WhiteboardUi.canvasElement.bind("mouseup", WhiteboardUi.endErasing);
	    WhiteboardUi.canvasElement.bind("mouseout", WhiteboardUi.endErasing);
	},
	
	endErasing: function(event) {
		WhiteboardUi.canvasElement.unbind("mousemove");
	}
	
}


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

})();