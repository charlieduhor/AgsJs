
"use strict";

module org.ags.engine {
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
    };
}
