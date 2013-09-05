
"use strict";

module org.ags.utils {
    export class Guid {
        public create() : string {
            function s4() : string {
                return Math.floor((1 + Math.random()) * 0x10000)
                             .toString(16)
                             .substring(1);
            }
            
            return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();
        }
    }
}
