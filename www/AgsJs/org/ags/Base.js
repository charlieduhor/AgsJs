(function() {
	"use strict";
	
	var ctor = function() {};
	
	function inherits(parent, protoProps, staticProps) {
		var child;
		
		if (protoProps && protoProps.hasOwnProperty('initialize')) {
			child = protoProps.initialize;
		}
		else {
			child = function () {
				return parent.apply(this.arguments);
			};
		}
		
		_.extend(child, parent);
		
		ctor.prototype = parent.prototype;
		child.prototype = new ctor();
		
		if (protoProps) {
			_.extend(child.prototype, protoProps);
		}
		
		if (staticProps) {
			_.extend(child, staticProps);
		}
		
		child.prototype.initialize = child;
		
		child.__super__ = parent.prototype;
		return child;
	};
	
	function extendThis(protoProps, staticProps) {
		var child = inherits(this, protoProps, staticProps);
		
		child.extend = extendThis;
		return child;
	}
	
	if (window.packages == undefined) {
		window.packages = {};
	}

	if (window.packages.org == undefined) {
		window.packages.org = {};
	}

	if (window.packages.org.ags == undefined) {
		window.packages.org.ags = {};
	}

	window.packages.org.ags.BaseClass = function() {		
	};
	
	window.packages.org.ags.BaseClass.extend = extendThis;
})();
