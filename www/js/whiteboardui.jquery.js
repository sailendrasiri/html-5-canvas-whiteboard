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
	
	init: function(canvasElement) {
		this.canvasElement = canvasElement;
		Whiteboard.init(canvasElement.attr("id"));
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
	
	activatePencil: function(event) {
		WhiteboardUi.canvasElement.bind("mousedown", WhiteboardUi.beginPencilDraw);
		// TODO: Image location to conf
		WhiteboardUi.canvasElement.css('cursor', 'url(img/pencil.gif), auto');
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
		WhiteboardUi.canvasElement.unbind();
		WhiteboardUi.canvasElement.css('cursor', 'auto');
	},
	
	activateEraser: function(event) {
		WhiteboardUi.canvasElement.bind("mousedown", WhiteboardUi.beginErasing);
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
		WhiteboardUi.canvasElement.unbind();
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