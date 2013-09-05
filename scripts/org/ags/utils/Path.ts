
"use strict";

module org.ags.utils {
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
                return Path.simplify(u2);
            }
            else if (u1.endsWith('/')) {
                return Path.simplify(u1 + u2);
            }
            else {
                return Path.simplify(u1 + "/" + u2);
            }
        }
        
        public static getBasePath() : string {
            var parts : string[] = window.location.pathname.split("/");
            
            parts[parts.length - 1] = undefined;
            parts.length--;
            
            return window.location.protocol + "//" + parts.join("/");
        }
    }
}
