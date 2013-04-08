
module org.ags {
    export class StageParameters {
        public game     : string = "default";
        public baseURL  : string = "Games/";
        public selector : string = "stage";
    };

    export class Stage {
        public game     : string;
        public baseURL  : string;
        public selector : string;
        public url      : string;
        public canvas   : HTMLCanvasElement;

        public gameObjects : org.ags.GameObject[] = [];
        
        constructor(parameters : StageParameters) {
            this.game     = parameters.game;
            this.baseURL  = parameters.baseURL;
            this.selector = parameters.selector;
            
            this.setup();
            this.createCanvas();
            this.loadSettings();
        }
        
        private setup() {
            if (this.baseURL.slice(-1) != "/") {
                this.baseURL += "/";
            }
            
            if (this.url === undefined) {
                this.url = this.baseURL + this.game;
            }
    
            if (this.url.slice(-1) != "/") {
                this.url += "/";
            }
        }
        
        private createCanvas() {
            var div : HTMLDivElement = <HTMLDivElement>document.getElementById(this.selector);
            
            if (div === undefined) {
                alert("Failed to find a #" + this.selector + " element on the page.");
            }
            
            this.canvas = <HTMLCanvasElement>document.createElement("canvas");
            div.appendChild(this.canvas);
        }
        
        public loadImage(
            url             : string,
            callbackSuccess : (image : HTMLImageElement, url? : string) => any,
            callbackFail    : (errorCode? : number, errorText? : string, url? : string) => any) : HTMLImageElement {
            
            var fullUrl      : string = this.url + url;
            var errorWrapper : () => any;
            
            if (callbackFail === undefined) {
                errorWrapper = function() {
                    var errorMessage : string = "Error loading image '" + fullUrl + "'";
                
                    console.error(errorMessage);
                    alert(errorMessage);
                };
            }
            else {
                errorWrapper = function() {
                    callbackFail(-1, "Failed to load image", url);
                };
            }
            
            var img : HTMLImageElement = new HTMLImageElement();
            
            img.onload  = function() { callbackSuccess(img, url); };
            img.onerror = errorWrapper;
            img.onabort = errorWrapper;
            img.src     = fullUrl;
            return img;
        }
        
        public loadDataAsync(
            url : string, 
            callbackSuccess : (data : any, url : string) => any,
            callbackFail    : (errorCode : number, errorText : string, url : string) => any,
            dataProcessor?  : (data : any) => any) : XMLHttpRequest {
            var xhr     : XMLHttpRequest = new XMLHttpRequest();
            var fullUrl : string         = this.url + url;
            
            if (dataProcessor === undefined) {
                dataProcessor = function(d) { return d; }
            }
            
            xhr.onload = function() {
                if (xhr.readyState === 4) {
                    callbackSuccess(dataProcessor(xhr.response), url);
                }
            };
            
            xhr.onerror = xhr.onabort = function() {
                if (xhr.status !== 0) {
                    callbackFail(xhr.status, xhr.statusText, url);
                }
            };
            
            xhr.open("GET", fullUrl, true);
            
            try {
                xhr.send();
            }
            catch (e) {
                callbackFail(e.code, e.message, url);
            }
            
            return xhr;
        }
        
        public loadData(url : string, dataProcessor?  : (data : any) => any) : any {
            var xhr     : XMLHttpRequest = new XMLHttpRequest();
            var fullUrl : string         = this.url + url;
            
            xhr.open("GET", fullUrl, false);
            xhr.send();
            
            if (xhr.status === 200) {
                if (dataProcessor === undefined) {
                    return xhr.response;
                }
                
                return dataProcessor(xhr.response);
            }
            
            throw {
                errorCode: xhr.status,
                errorText: xhr.statusText,
                url:       url,
                request:   xhr,
            };
        }
        
        public loadJson(url : string) : any {
            return this.loadData(url, JSON.parse);
        }
        
        public loadJsonAsync(
            url : string, 
            callbackSuccess : (data : any, url : string) => any,
            callbackFail    : (errorCode : number, errorText : string, url : string) => any) : XMLHttpRequest {
            return this.loadDataAsync(url, callbackSuccess, callbackFail, JSON.parse);
        }
        
        public loadSettings() {
            var that = this;
            
            this.loadJsonAsync("settings.json",
            
            function(data : any) : any {
                that.canvas.width  = data.resolution.width;
                that.canvas.height = data.resolution.height;
            },
            
            function (errorCode : number, errorString : string) : any {
                console.error(errorString);
            });
        }
    };
}
