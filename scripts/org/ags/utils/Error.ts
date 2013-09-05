
"use strict";

module org.ags.utils {
    export interface IError {
        errorString : string;
        errorCode   : number;
        
        toString() : string;
    };
    
    export interface ILoadError extends IError {
        url : string;
    };
    
    export class Error implements IError {
        public errorCode   : number;
        public errorString : string;
        
        constructor(errorCode : number, errorString : string) {
            this.errorString = errorString;
            this.errorCode   = errorCode;
        }
        
        toString() : string {
            return "{0}: {1}".format(this.errorCode, this.errorString);
        }
        
        public static __HIDE_IN_EDITOR__ : boolean = true;
    };
}
