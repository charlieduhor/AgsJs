
"use strict";

module org.ags.engine {
	export interface GameResolutionSettings {
		width  : number;
		height : number;
	};
	
	export interface GameLoopSettings {
		interval : any;
	};

	export interface GameSettings {
		resolution       : GameResolutionSettings;
		loop             : GameLoopSettings;
        startupScene     : string;
	};
	
	export interface IUpdatableComponent extends IOrderableComponent {
		update();
	};
	
	export interface IDrawableComponent extends IOrderableComponent {
		drawCanvas(context : CanvasRenderingContext2D);
	};

    export class StageParameters {
        public game     : string = "default";
        public baseURL  : string = "Games/";
        public selector : string = "stage";
    };

    class StageLoadError implements ILoadError {
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
    };

    export class Stage {
        public game          : string;
        public baseURL       : string;
        public selector      : string;
        public url           : string;
        public canvas        : HTMLCanvasElement;
        public canvasContext : CanvasRenderingContext2D;
        public gameSettings  : GameSettings;

        public currentSet    : Set;
        
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
            
            this.canvasContext = this.canvas.getContext("2d");
        }
        
        public loadImage(
            url             : string,
            callbackSuccess : (image : HTMLImageElement, url? : string) => any,
            callbackFail    : (error : ILoadError) => any) : HTMLImageElement {
            
            var fullUrl      : string = this.url + url;
            
            if (callbackFail === undefined) {
                throw new StageLoadError(-1, "You must specify an load failure handler.", url);
            }
            
            var errorWrapper = function() {
                callbackFail(new StageLoadError(-1, "Failed to load image", url));
            };
            
            var img : HTMLImageElement = <HTMLImageElement>document.createElement("img");
            
            img.onload  = function() { callbackSuccess(img, url); };
            img.onerror = errorWrapper;
            img.onabort = errorWrapper;
            img.src     = fullUrl;
            return img;
        }
        
        public loadDataAsync(
            url : string, 
            callbackSuccess : (data : any, url : string) => any,
            callbackFail    : (error : ILoadError) => any,
            dataProcessor?  : (data : any) => any) : XMLHttpRequest {
            var xhr     : XMLHttpRequest = new XMLHttpRequest();
            var fullUrl : string         = this.url + url;
            
            if (dataProcessor === undefined) {
                dataProcessor = function(d) { return d; }
            }
            
            var errorFunction = function() {
                if (xhr.status !== 0) {
                    callbackFail(new StageLoadError(xhr.status, xhr.statusText, url));
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
                callbackFail(new StageLoadError(e.code, e.message, url));
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
            
            throw new StageLoadError(xhr.status, xhr.statusText, url);
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
        
        public loadSettings() {
            var that = this;
            
            this.loadJsonAsync("settings.json",
                function(data : any) : any {
                    that.setSettings(data);
                    that.start();
                },
            
                function (error : ILoadError) : any {
                    this.fatalError("Failed to load game settings", error);
                });
        }
        
        private setSettings(settings : GameSettings) {
        	this.gameSettings  = settings;
            this.canvas.width  = settings.resolution.width;
            this.canvas.height = settings.resolution.height;
            
            if (typeof settings.loop.interval === "string") {
            	if (settings.loop.interval === "NTSC") {
            		settings.loop.interval = 1001 / 30;
            	}
            	else if (settings.loop.interval === "PAL") {
            		settings.loop.interval = 1001 / 25;
            	}
            	else {
            		throw "Invalid loop interval value: " + settings.loop.interval;
            	}
            }
        }
        
        public start() {
            var that = this;
            
            this.currentScene = this.gameSettings.startupScene;
        }
        
        public get currentScene() : string {
            if (this.currentSet === undefined) {
                return undefined;
            }
            
            return this.currentSet.name;
        }
        
        public set currentScene(sceneName : string) {
            if (this.currentSet) {
                if (this.currentSet.name === sceneName) {
                    return;
                }
            }
            
            var that = this;
            var newSet : Set = new Set(this, sceneName);
            
            this.loadJsonAsync(
                "scenes/" + sceneName + ".json",
                function(data : any) : any {
                    newSet.load(
                        data,
                        function() {
                            that.finishedLoadingScene(newSet);
                        },
                        function(error : IError) {
                            Log.error("Failed to load scene {0}. {1}", sceneName, error.toString());
                        });
                },
                function(error : ILoadError) {
                    Log.error("Failed to load scene {0}. {1}", sceneName, error.toString());
                });
        }
        
        private finishedLoadingScene(newSet : Set) {
            var that = this;
            
            if (this.currentSet === undefined) {
                setInterval(function () { that.currentSet.loop(); }, this.gameSettings.loop.interval);
            }
            
            this.currentSet = newSet;
        }
        
        public fatalError(message : string, errorInfo : IError) {
        }
    };
}
