
(function() {
    "use strict";
    
    if (window.oo == undefined) {
        window.oo = {};
    }

    if (window.oo.namespaces == undefined) {
        window.oo.namespaces = {};
    }

    window.oo.namespace = function(namespaceString) {
        var parts       = namespaceString.split('.');
        var parent      = window.oo.namespaces;
        var currentPart = '';
        
        for(var i = 0, length = parts.length; i < length; i++) {
            currentPart = parts[i];
            
            if (parent[currentPart] === undefined) {
                parent[currentPart] = {};
            }
            
            parent = parent[currentPart];
        }
        
        return parent;
    };
    
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

    window.oo.BaseClass = function() {};
    window.oo.BaseClass.extend = extendThis;
})();