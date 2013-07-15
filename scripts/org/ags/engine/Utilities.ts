
"use strict";

interface String {
    vformat(args : any[]) : string;
    format(...args : any[]) : string;
    startsWith(s : string) : bool;
    endsWith(s : string) : bool;
}

module org.ags.engine {
    export class Path {
        public static dirname(url : string) : string {
            var li = url.lastIndexOf('/');
            
            if (li === -1) {
                return "";
            }
            
            return url.substring(0, li);
        }
        
        public static simplify(u1 : string) : string {
            var parts = u1.split("/");
            var index, count = parts.length;
            
            for (index = 0; index < count; index++) {
                var p = parts[index];
                
                if (p === ".") {
                    parts  = parts.splice(index, 1);
                    count -= 1;
                }
                else if (p === "..") {
                    if (index > 0) {
                        if (p[index - 1] !== "..") {
                            parts  = parts.splice(index - 1, 2);
                            index -= 1;
                            count -= 2;
                        }
                    }
                }
            }
            
            return parts.join("/");
        }
        
        public static join(u1 : string, u2 : string) : string {
            if (u2.startsWith("/")) {
                return simplify(u2);
            }
            else if (u1.endsWith('/')) {
                return simplify(u1 + u2);
            }
            else {
                return simplify(u1 + "/" + u2);
            }
        }
    };
    
    export class Utilities {
        public static getBasePath() : string {
            var parts = window.location.pathname.split("/");
            
            parts[parts.length - 1] = undefined;
            parts.length--;
            
            return window.location.protocol + "//" + parts.join("/");
        };
        
        public static parseQueryString(queryString? : string, urlParams? = {}) : {} {
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
        
        public static guid() : string {
            function s4() : string {
                return Math.floor((1 + Math.random()) * 0x10000)
                             .toString(16)
                             .substring(1);
            }
            
            return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();
        }
    }
}
