(function() {
    "use strict";

    function GameLoop() {
    }

    function GameLoad() {
        var parameters = window.oo.parseQueryString();
        
        if (parameters.game === undefined) {
        	parameters.game = "default";
        }
        
        if (parameters.url === undefined) {
        	parameters.url = "Games/";
        }
        
        $("#stage").html("<canvas></canvas>");
        
        $.ajax(parameters.url + parameters.game, {
        	success: function(data) {
        		console.log(data);
        	},
        	
        	error: function(xhr, textStatus, errorThrown) {
        		alert("Error " + xhr.status + " while loading \"" + parameters.url +  "\": " + textStatus);
        	}
        });
    }

    GameLoad();
})();