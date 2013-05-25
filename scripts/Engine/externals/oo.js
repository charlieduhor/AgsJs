
(function() {
    "use strict";
    
    if (window.oo == undefined) {
        window.oo = {};
    }

    if (window.oo.namespaces == undefined) {
        window.oo.namespaces = {};
    }

    window.oo.namespace = function(namespaceString) {
        var parts;
        
        if (namespaceString instanceof Array) {
        	parts = namespaceString;
        }
        else {
        	parts = namespaceString.split('.');
        }
        
        var parent      = window.oo.namespaces;
        var currentPart = '';
        
        for (var i = 0, length = parts.length; i < length; i++) {
            currentPart = parts[i];
            
            if (parent[currentPart] === undefined) {
                parent[currentPart] = {};
            }
            
            parent = parent[currentPart];
        }
        
        return parent;
    };
    
    window.oo.getBasePath = function() {
    	var parts = window.location.pathname.split("/");
    	
    	parts[parts.length - 1] = undefined;
    	parts.length--;
    	
    	return window.location.protocol + "//" + parts.join("/");
    };
    
    window.oo.parseQueryString = function(queryString) {
    	if (queryString == undefined) {
    		queryString = window.location.search;
    	}
    	
    	if (queryString.length == 0) {
    		return {};
    	}
    	
        var match;
        var pl        = /\+/g;  // Regex for replacing addition symbol with a space
        var search    = /([^&=]+)=?([^&]*)/g;
        var decode    = function (s) { return decodeURIComponent(s.replace(pl, " ")); };
        var urlParams = {};
        
        queryString = queryString.substring(1);

        while (match = search.exec(queryString)) {
           urlParams[decode(match[1])] = decode(match[2]);
        }
        
        return urlParams;
    };
    
    function inherits(parent, protoProps, staticProps) {
        var child;
        
        if (protoProps && _.has(protoProps, 'constructor')) {
            child = protoProps.constructor;
        }
        else {
            child = function () {
                return parent.apply(this, arguments);
            };
        }
        
        _.extend(child, parent, staticProps);
        
        var Surrogate = function(){ this.constructor = child; };
        Surrogate.prototype = parent.prototype;
        child.prototype = new Surrogate;

        if (protoProps) {
        	_.extend(child.prototype, protoProps);
        }
        
        child.__super__ = parent.prototype;
        return child;
    };
    
    function extendThis(protoProps, staticProps) {
        var child = inherits(this, protoProps, staticProps);
        
        child.extend = extendThis;
        return child;
    }

    window.oo.BaseClass = function() {};
    window.oo.BaseClass.extend = extendThis;
})();

function namespace(namespaceName) {
	return window.oo.namespace(namespaceName);
}

function defineClass(fullClassName, constructor) {
	var parts     = fullClassName.split(".");
	var className = parts[parts.length - 1];
	
	parts.length--;
	
	var ns = window.oo.namespace(parts);
	
	ns[className] = constructor;
}
