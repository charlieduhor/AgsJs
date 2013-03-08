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
        
        this.loadURL("settings.json");
    };
    
    Stage.prototype.gameObjects = [];
    
    Stage.prototype.loadURL = function(url) {
    	var that = this;
    	
    	$.ajax({
    		url:      that.parameters.url + url,
    		type:     "get",
    		dataType: "json",
    		async:    true,
    		
    		success: function(data) {
    			console.log(data);
    		},
    		
    		error: function(xhr, status, errorThrown) {
    			alert(status);
    		}
      	});
    };
    
    defineClass("org.ags.Stage", function(parameters) {
    	return new Stage(parameters);
    });
})();
