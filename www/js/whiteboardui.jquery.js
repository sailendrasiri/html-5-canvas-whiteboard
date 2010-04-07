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
	
	zoomrel: 1,
	canvasElement: null, // jQuery element for canvas
	elementConf: {
		pencil: 'pencil_active',
		eraser: 'eraser_active',
		rectangle: 'rectangle_active',
		oval: 'oval_active',
		button_pencil: 'button_pencil',
		button_color: 'button_color',
		button_eraser: 'button_eraser',
		button_zoomin: 'button_zoomin',
		button_zoomout: 'button_zoomout',
		button_zoom: 'button_zoom',
		button_rotate: 'button_rotate',
		button_animate: 'button_animate',
		button_shape: 'button_shape',
		button_rectangle: 'button_rectangle',
		button_oval: 'button_oval',
		input_color: 'color',
		input_rotation: 'rotation',
		shape_menu: 'shape_menu',
		zoom_element: 'zoom',
		zoom_section: 'zoomsection',
		zoom_amount: 'zoomamount',
		zoom_slider: 'zoomslider',
		zoom_bar: 'zoombar',
	},
	activeElems: {
		shape_menu: false,
		zoom: false,
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
		WhiteboardUi.getElement('button_zoom').mousedown(WhiteboardUi.zoomBar);
		WhiteboardUi.getElement('button_rotate').mousedown(function() {
			var rot = parseInt(WhiteboardUi.getElement('input_rotation').attr("value"));
			if (rot >= -360 && rot <= 360) {
				Whiteboard.rotate(rot);
			} else {
				alert("Rotation value between -360 and 360!");
			}
		});
		WhiteboardUi.getElement('button_animate').mousedown(Whiteboard.animate);
		//remove onmousedown from html and make this work
		//WhiteboardUi.getElement('button_undo').mousedown(Whiteboard.undo);
		WhiteboardUi.getElement('button_shape').mouseup(WhiteboardUi.shapeMenu);
		WhiteboardUi.getElement('button_rectangle').mousedown(function() {
			Whiteboard.setStrokeStyle(WhiteboardUi.getElement('input_color').attr("value"));
			WhiteboardUi.shapeMenu();
			WhiteboardUi.activateRectangle();
		});
		WhiteboardUi.getElement('button_oval').mousedown(function() {
			Whiteboard.setStrokeStyle(WhiteboardUi.getElement('input_color').attr("value"));
			WhiteboardUi.shapeMenu();
			WhiteboardUi.activateOval();
		});
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
		WhiteboardUi.canvasElement.removeClass(WhiteboardUi.elementConf.rectangle);
		WhiteboardUi.canvasElement.removeClass(WhiteboardUi.elementConf.oval);
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
		WhiteboardUi.canvasElement.unbind("mouseup");
		WhiteboardUi.canvasElement.unbind("mouseout");
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
		WhiteboardUi.canvasElement.unbind("mouseup");
		WhiteboardUi.canvasElement.unbind("mouseout");
	},
	
	zoomBar: function(event) {
		var zoom = WhiteboardUi.getElement('zoom_element');
		if (WhiteboardUi.activeElems.zoom === false) {
			WhiteboardUi.activeElems.zoom = true;
			zoom.css('opacity', 0);
			zoom.css('display', 'block');
			zoom.animate({
				opacity: 1
			}, 150);
			WhiteboardUi.activateZoom();
		} else {
			WhiteboardUi.activeElems.zoom = false;
			zoom.animate({
				opacity: 0
			}, 150, function() {
				zoom.css('display', 'none');
			});
		}
	},
	
	activateZoom: function(event) {
		var slider = WhiteboardUi.getElement('zoom_slider');
		var zoomSec = WhiteboardUi.getElement('zoom_section');
		var height = zoomSec.height() - slider.height();
		var sy = zoomSec.offset().top + zoomSec.height();
		
		slider.draggable({
			axis: 'y',
			containment: 'parent',
			drag: function(event, ui) {
				var amount = WhiteboardUi.getElement('zoom_amount');
				var ey = event.clientY;
				var px = zoomSec.height() - slider.height() - $(this).position().top;
				var zoom = 2 * px / height
				WhiteboardUi.getElement('zoom_amount').html(parseInt(100 * zoom) + "%");
			},
			stop: function(event, ui) {
				WhiteboardUi.performZoom();
			}
		});
	},
	
	performZoom: function(event) {
		var zoom = parseInt(WhiteboardUi.getElement('zoom_amount').html()) / 100;
		
		var rel = (1 + zoom) / WhiteboardUi.zoomrel;
		Whiteboard.zoom(rel);
		WhiteboardUi.zoomrel = 1 + zoom;
	},
	
	shapeMenu: function(event) {
		var menu = WhiteboardUi.getElement('shape_menu');
		if (WhiteboardUi.activeElems.shape_menu === false) {
			WhiteboardUi.activeElems.shape_menu = true;
			var wid = menu.css('width');
			var hei = menu.css('height');
			menu.css('width', '0');
			menu.css('height', '0');
			menu.css('display', 'block');
			menu.animate({ 
			    width: wid,
			    height: hei
			}, 150);
		} else {
			WhiteboardUi.activeElems.shape_menu = false;
			menu.animate({ 
			    opacity: 0
			}, 150, function() {
				menu.css('display', 'none');
				menu.css('opacity', '1');
			});
		}
	},
	
	activateRectangle: function(event) {
		WhiteboardUi.changeTool();
		WhiteboardUi.canvasElement.bind("mousedown", WhiteboardUi.beginRectangle);
		WhiteboardUi.canvasElement.addClass(WhiteboardUi.elementConf.rectangle);
	},
	
	beginRectangle: function(event) {
		Whiteboard.beginShape(WhiteboardUi.getX(event), WhiteboardUi.getY(event));
	    WhiteboardUi.canvasElement.bind("mousemove", function(event) {
	    	Whiteboard.drawRectangle(WhiteboardUi.getX(event), WhiteboardUi.getY(event));
	    });
		WhiteboardUi.canvasElement.bind("mouseup", WhiteboardUi.endRectangle);
	},
	
	endRectangle: function(event) {
		Whiteboard.drawRectangle(WhiteboardUi.getX(event), WhiteboardUi.getY(event));
		WhiteboardUi.canvasElement.unbind("mousemove");
		WhiteboardUi.canvasElement.unbind("mouseup");
	},
	
	activateOval: function(event) {
		WhiteboardUi.changeTool();
		WhiteboardUi.canvasElement.bind("mousedown", WhiteboardUi.beginOval);
		WhiteboardUi.canvasElement.addClass(WhiteboardUi.elementConf.oval);
	},
	
	beginOval: function(event) {
		Whiteboard.beginShape(WhiteboardUi.getX(event), WhiteboardUi.getY(event));
	    WhiteboardUi.canvasElement.bind("mousemove", function(event) {
	    	Whiteboard.drawOval(WhiteboardUi.getX(event), WhiteboardUi.getY(event));
	    });
	    WhiteboardUi.canvasElement.bind("mouseup", WhiteboardUi.endOval);
	},
	
	endOval: function(event) {
		Whiteboard.drawOval(WhiteboardUi.getX(event), WhiteboardUi.getY(event));
		WhiteboardUi.canvasElement.unbind("mousemove");
		WhiteboardUi.canvasElement.unbind("mouseup");
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
