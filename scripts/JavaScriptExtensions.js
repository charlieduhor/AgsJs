
"use strict";

String.prototype.vformat = function(args) {
    var s = this;
    
    for (var i = 0; i < args.length; i++) {
        var reg = new RegExp("\\{" + i + "\\}", "gm");
        s = s.replace(reg, args[i]);
    }
    
    return s;
}

String.prototype.format = function() {
    var s = this;
    
    for (var i = 0; i < arguments.length; i++) {
        var reg = new RegExp("\\{" + i + "\\}", "gm");
        s = s.replace(reg, arguments[i]);
    }
    
    return s;
}
