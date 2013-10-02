
"use strict";

interface String {
    vformat(args : any[]) : string;
    format(...args : any[]) : string;
    startsWith(s : string) : boolean;
    endsWith(s : string) : boolean;
}

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

String.prototype.startsWith = function (str) {
    return this.indexOf(str) === 0;
};

String.prototype.endsWith = function (str) {
    return this.slice(-str.length) === str;
};
