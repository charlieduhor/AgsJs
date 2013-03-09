(function() {
    "use strict";
    
    if (window["ags"] == undefined) {
    	window.ags = {};
    }
    
    function Stage(parameters) {
    	if (window.ags["stage"] === undefined) {
    		window.ags.stage = this;
    	}
    	
    	this.parameters = {};
    	
        _.extend(this.parameters, {
        	game:     "default",
        	baseURL:  "Games/",
        	selector: "stage",
        }, parameters);
        
        if (this.parameters.baseURL.slice(-1) != "/") {
        	this.parameters.baseURL += "/";
        }
        
        if (this.parameters.url === undefined) {
        	this.parameters.url = this.parameters.baseURL + this.parameters.game;
        }

        if (this.parameters.url.slice(-1) != "/") {
        	this.parameters.url += "/";
        }

        var div = document.getElementById(this.parameters.selector);
        
        if (div == undefined) {
        	alert("Failed to find a #" + this.parameters.selector + " element on the page.");
        }
        
        this.canvas = document.createElement("canvas");
        div.appendChild(this.canvas);
        
        var that = this;
        
        this.loadURL("settings.json", function(data) {
        	that.canvas.width  = data.resolution.width;
        	that.canvas.height = data.resolution.height;
        	
            that.loadImage("Pixelart-tv-iso.png", function(data) {
            	var c = that.canvas.getContext("2d");
            	
            	c.imageSmoothingEnabled       = false;
            	c.mozImageSmoothingEnabled    = false;
            	c.webkitImageSmoothingEnabled = false;
            	c.drawImage(data, 0, 0);
            });
        });
    };
    
    Stage.prototype.gameObjects = [];
    
    Stage.prototype.loadImage = function(url, callbackSuccess, callbackFail) {
    	var that    = this;
    	var fullUrl = that.parameters.url + url;
    	var errorWrapper;
    	
    	if (callbackFail === undefined) {
    		errorWrapper = function() {
    			console.error("Error loading image '" + fullUrl + "'");
				alert("Error loading file '" + fullUrl + "'");
    		};
    	}
    	else {
    		errorWrapper = function() {
        		callbackFail(img, url);
        	};
    	}
    	
    	var img = new Image();
    	
    	img.onload  = function() { callbackSuccess(img, url); };
    	img.onerror = errorWrapper;
    	img.onabort = errorWrapper;
    	img.src     = fullUrl;
    	return img;
    };
    
    Stage.prototype.loadURL = function(url, callbackSuccess, callbackFail) {
    	var that    = this;
    	var fullUrl = that.parameters.url + url;
    	
    	if (callbackFail === undefined) {
    		callbackFail = function(xhr, status, errorThrown) {
    			console.error("Error loading file '" + fullUrl + "'. Error "+ xhr.status + ": " + errorThrown);
				alert("Error loading file '" + fullUrl + "'\n\nError "+ xhr.status + ": " + errorThrown);
    		};
    	}
    	
    	$.ajax({
    		url:      fullUrl,
    		type:     "get",
    		dataType: "json",
    		async:    true,
    		success:  callbackSuccess,
    		error:    callbackFail,
      	});
    };
    
    defineClass("org.ags.Stage", function(parameters) {
    	return new Stage(parameters);
    });
})();
