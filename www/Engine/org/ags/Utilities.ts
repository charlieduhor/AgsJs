
"use strict";

module org.ags {
    export function getBasePath() : string {
        var parts = window.location.pathname.split("/");
        
        parts[parts.length - 1] = undefined;
        parts.length--;
        
        return window.location.protocol + "//" + parts.join("/");
    };
    
    export function parseQueryString(queryString? : string, urlParams? = {}) : {} {
        if (queryString == undefined) {
            queryString = window.location.search;
        }
        
        if (queryString.length == 0) {
            return urlParams;
        }
        
        var match;
        var pl        = /\+/g;  // Regex for replacing addition symbol with a space
        var search    = /([^&=]+)=?([^&]*)/g;
        var decode    = function (s) { return decodeURIComponent(s.replace(pl, " ")); };
        
        queryString = queryString.substring(1);

        while (match = search.exec(queryString)) {
           urlParams[decode(match[1])] = decode(match[2]);
        }
        
        return urlParams;
    };
}