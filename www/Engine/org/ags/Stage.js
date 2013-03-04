(function() {
    "use strict";
    
    var ags = oo.namespace("org.ags");
    
    function Stage(parameters) {
    	this.parameters = {};
    	
        _.extend(this.parameters, {
        	game:     "default",
        	baseURL:  "Games/",
        	selector: "#stage",
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

        $(this.parameters.selector).html("<canvas></canvas>");
        
        this.loadURL("settings.json");
    };
    
    Stage.prototype.loadURL = function(url) {
    	$.getJSON(this.parameters.url + url, function(data) {
    		console.log(data);
      	});
    };
    
    Stage.currentStage = undefined;
    
    ags.Stage = function(parameters) {
    	return new Stage(parameters);
    };
})();
