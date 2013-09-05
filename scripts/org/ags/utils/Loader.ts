
"use strict";

module org.ags.utils {
    export interface ILoader {
        loadImage(
            url             : string,
            callbackSuccess : (image : HTMLImageElement, url? : string) => any,
            callbackFail    : (error : ILoadError) => any) : HTMLImageElement;

        loadScript(
            url             : string,
            callbackSuccess : (script : HTMLScriptElement, url? : string) => any,
            callbackFail    : (error : ILoadError) => any) : HTMLScriptElement;
        
        loadData(url : string, dataProcessor?  : (data : any) => any) : any;
        loadJson(url : string) : any;
        
        loadDataAsync(
            url : string, 
            callbackSuccess : (data : any, url : string) => any,
            callbackFail    : (error : ILoadError) => any,
            dataProcessor?  : (data : any) => any) : XMLHttpRequest;
        
        loadJsonAsync(
            url : string, 
            callbackSuccess : (data : any, url : string) => any,
            callbackFail    : (error : ILoadError) => any) : XMLHttpRequest;
    }
    
    export class LoadError implements ILoadError {
        public loadErrorCode   : number;
        public loadErrorString : string;
        public loadUrl         : string;
        
        public errorCode   : number;
        public errorString : string;
        public url         : string;
        
        constructor(errorCode : number, errorString : string, url : string) {
            this.loadErrorString = errorString;
            this.loadErrorCode   = errorCode;
            this.loadUrl         = url;
            
            this.errorString = errorString;
            this.errorCode   = errorCode;
            this.url         = url;
        }
        
        toString() : string {
            return "{0}: {1} ({2})".format(this.loadErrorString, this.loadErrorCode, this.loadUrl);
        }
    }
    
    export class Loader implements ILoader {
        private baseUrl : string;
        
        constructor(baseUrl : string) {
            this.baseUrl = baseUrl;
        }

        public loadImage(
            url             : string,
            callbackSuccess : (image : HTMLImageElement, url? : string) => any,
            callbackFail    : (error : ILoadError) => any) : HTMLImageElement {
            
            if (url.startsWith('/')) {
                url = url.substring(1);
            }
            
            var fullUrl : string = Path.join(this.baseUrl, url);
            
            if (callbackFail === undefined) {
                throw new LoadError(-1, "You must specify an load failure handler.", url);
            }
            
            var errorWrapper = function() {
                callbackFail(new LoadError(-1, "Failed to load image", url));
            };
            
            var img : HTMLImageElement = <HTMLImageElement>document.createElement("img");
            
            img.onload  = function() { callbackSuccess(img, url); };
            img.onerror = errorWrapper;
            img.onabort = errorWrapper;
            img.src     = fullUrl;
            return img;
        }

        public loadScript(
            url             : string,
            callbackSuccess : (script : HTMLScriptElement, url? : string) => any,
            callbackFail    : (error : ILoadError) => any) : HTMLScriptElement {
            
            if (url.startsWith('/')) {
                url = url.substring(1);
            }
            
            var fullUrl : string = Path.join(this.baseUrl, url);
            
            if (callbackFail === undefined) {
                throw new LoadError(-1, "You must specify an load failure handler.", url);
            }
            
            var errorWrapper = function() {
                callbackFail(new LoadError(-1, "Failed to load script", url));
            };
            
            var script : HTMLScriptElement = <HTMLScriptElement>document.createElement("script");
            
            script.onload  = function() { callbackSuccess(script, url); };
            script.onerror = errorWrapper;
            script.onabort = errorWrapper;
            script.src     = fullUrl;
            script.type    = "text/javascript";
            
            document.getElementsByTagName("head")[0].appendChild(script);
            return script;
        }
        
        public loadDataAsync(
            url : string, 
            callbackSuccess : (data : any, url : string) => any,
            callbackFail    : (error : ILoadError) => any,
            dataProcessor?  : (data : any) => any) : XMLHttpRequest {
            
            if (url.startsWith('/')) {
                url = url.substring(1);
            }
                
            var xhr     : XMLHttpRequest = new XMLHttpRequest();
            var fullUrl : string         = Path.join(this.baseUrl, url);
            
            if (dataProcessor === undefined) {
                dataProcessor = function(d) { return d; }
            }
            
            var errorFunction = function() {
                if (xhr.status !== 0) {
                    callbackFail(new LoadError(xhr.status, xhr.statusText, url));
                }
            };
            
            xhr.onload = function() {
                if (xhr.status >= 400) {
                    errorFunction();
                }
                else if (xhr.readyState === 4) {
                    callbackSuccess(dataProcessor(xhr.response), url);
                }
            };
            
            xhr.onerror = xhr.onabort = errorFunction;
            xhr.open("GET", fullUrl, true);
            
            try {
                xhr.send();
            }
            catch (e) {
                callbackFail(new LoadError(e.code, e.message, url));
            }
            
            return xhr;
        }
        
        public loadData(url : string, dataProcessor?  : (data : any) => any) : any {
            var xhr     : XMLHttpRequest = new XMLHttpRequest();
            var fullUrl : string         = this.baseUrl + url;
            
            xhr.open("GET", fullUrl, false);
            xhr.send();
            
            if (xhr.status === 200) {
                if (dataProcessor === undefined) {
                    return xhr.response;
                }
                
                return dataProcessor(xhr.response);
            }
            
            throw new LoadError(xhr.status, xhr.statusText, url);
        }
        
        public loadJson(url : string) : any {
            return this.loadData(url, JSON.parse);
        }
        
        public loadJsonAsync(
            url : string, 
            callbackSuccess : (data : any, url : string) => any,
            callbackFail    : (error : ILoadError) => any) : XMLHttpRequest {
            return this.loadDataAsync(url, callbackSuccess, callbackFail, JSON.parse);
        }
    }
}
