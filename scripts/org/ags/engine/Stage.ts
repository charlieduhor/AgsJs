
"use strict";

module org.ags.engine {
    import utils = org.ags.utils;
    
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
        sceneNamespace   : string;
	};
	
	export interface IUpdatableComponent extends org.ags.utils.IOrderable {
		update() : void;
	};
	
	export interface IDrawableComponent extends org.ags.utils.IOrderable {
		drawCanvas(context : CanvasRenderingContext2D) : void;
	};
    
    export interface IEventComponent extends org.ags.utils.IOrderable {
        handleEvent(event : Event) : boolean;
    };

    export class StageParameters {
        public game     : string = "default";
        public baseURL  : string = "Games/";
        public selector : string = "stage";
    };

    export class StageLoaderDelegate extends org.ags.utils.Loader {
        private stage     : Stage;
        private newSet    : Set;
        private sceneName : string;
        
        constructor(stage : Stage, newSet : Set, sceneName : string) {
            super(stage.baseURL);
            this.stage     = stage;
            this.newSet    = newSet;
            this.sceneName = sceneName;
        }
        
        public progress(percent : number) {
        }
        
        public finished() {
            var cons;
            
            try {
                cons = eval(this.stage.gameSettings.sceneNamespace + "." + this.sceneName);
            }
            catch (e) {
            }
            
            if (cons) {
                this.newSet.sceneScript = new cons();
            }
            
            this.stage.finishedLoadingScene(this.newSet);
        }
        
        public error(error : utils.IError) : any {
            utils.Log.error("Failed to load scene {0}. {1}", this.sceneName, error.toString());
        }
        
        public createObject(loader : utils.JSONDeserializer, className : string, objectInfo : any) : any {
            if (className === "org.ags.engine.GameObject") {
                return this.newSet.createGameObject(objectInfo["name"]);
            }
            
            return undefined;
        }
        
        public postProcess(loader : utils.JSONDeserializer, basePath : string, classObject : any, objectInfo : {}) : boolean {
            if (classObject instanceof GameObject) {
                if (objectInfo["components"] !== undefined) {
                    var trs : any[]  = objectInfo["components"];
                    var index, count = trs.length;
                    
                    for (index = 0; index < count; index++) {
                        var tr : {} = trs[index];
                        
                        classObject.addComponent(loader.loadProperty(basePath, tr));
                    }
                }
                
                return true;
            }
            
            return false;
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
        
        private intervalId   : any;
        
        constructor(parameters : StageParameters) {
            this.game     = parameters.game;
            this.baseURL  = parameters.baseURL;
            this.selector = parameters.selector;
            
            this.setup();
            this.createCanvas();
            this.loadSettings();
        }
        
        public get loader() : utils.Loader {
            return new utils.Loader(this.baseURL);
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
        
        public loadSettings() {
            var that = this;
            
            this.loader.loadJsonAsync("settings.json",
                function(data : any) : any {
                    that.setSettings(data);
                    that.start();
                },
            
                function (error : utils.ILoadError) : any {
                    this.fatalError("Failed to load game settings", error);
                });
        }
        
        private setSettings(settings : GameSettings) {
        	this.gameSettings  = settings;
            this.canvas.width  = settings.resolution.width;
            this.canvas.height = settings.resolution.height;
            
            if (typeof settings.loop.interval === "string") {
            	if (settings.loop.interval === "NTSC") {
            		settings.loop.interval = 1001.0 / 30.0;
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
        
        public createJSONDeserializerDelegate(newSet : Set, sceneName : string) : utils.IJSONDeserializerDelegate {
            return new StageLoaderDelegate(this, newSet, sceneName);
        }
        
        public createJSONDeserializer(newSet : Set, sceneName : string) : utils.JSONDeserializer {
            return new utils.JSONDeserializer(this.createJSONDeserializerDelegate(newSet, sceneName));
        }
        
        public createSet(sceneName : string) : Set {
            return new Set(this, sceneName);
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
            var newSet : Set                    = this.createSet(sceneName);
            var loader : utils.JSONDeserializer = this.createJSONDeserializer(newSet, sceneName);

            loader.load("scenes/" + sceneName + "/" + sceneName + ".json");
            
            var ns : {};
            
            try {
                ns = eval(this.gameSettings.sceneNamespace);
            }
            catch (e) {
            }
            
            if (ns !== undefined) {
                if (ns[sceneName]) {
                    // Scene's script is already loaded.
                    return;
                }
            }
            
            loader.loadScript("scenes/" + sceneName + "/" + sceneName + ".js")
        }
        
        private performanceLastIntervalTime : number;
        private performanceSample           : number = 0;
        private performanceSampleCount      : number = 0;
        private performanceBeginFrame       : number;
        
        private startLoop() {
            var currentDate : Date = new Date();
            
            this.performanceBeginFrame = currentDate.getTime();
        }
        
        private endLoop() {
            var currentDate : Date   = new Date();
            var currentTime : number = currentDate.getTime();
            
            if (this.performanceLastIntervalTime === undefined) {
                this.performanceLastIntervalTime = currentTime;
            }
            else {
                var delta = currentTime - this.performanceLastIntervalTime;
                
                this.performanceSample          += delta;
                this.performanceSampleCount     += 1;
                this.performanceLastIntervalTime = currentTime;
                
                if (this.performanceSampleCount >= 240) {
                    console.log("Performance: Desired fps: " + 1000 / (this.gameSettings.loop.interval));
                    console.log("Performance: Average fps: " + 1000 / (this.performanceSample / this.performanceSampleCount));
                    console.log("Performance: Frame time:  " + (currentTime - this.performanceBeginFrame));
                    
                    this.performanceSample      = 0;
                    this.performanceSampleCount = 0;
                }
            }
        }
        
        public hookEvents() {
            var that = this;
            
            var eventHandler = function() {
                that.currentSet.dispatchEvent(window.event);
            };
            
            document.body.onkeydown = eventHandler;
            document.body.onkeyup   = eventHandler;
        }
        
        public finishedLoadingScene(newSet : Set) {
            var that = this;

            if (this.currentSet) {
                if (this.currentSet.sceneScript) {
                    this.currentSet.sceneScript.onExitScene(newSet, this.currentSet);
                }
            }

            if (newSet.sceneScript) {
                newSet.sceneScript.onAboutToEnterScene(newSet, this.currentSet);
            }

            if (this.currentSet === undefined) {
                this.hookEvents();
                this.intervalId = setInterval(function () {
                    that.startLoop();
                    that.currentSet.loop();
                    that.endLoop();
                },
                this.gameSettings.loop.interval);
            }
            
            var oldSet = this.currentSet;
            
            this.currentSet = newSet;
            
            if (newSet.sceneScript) {
                newSet.sceneScript.onEnterScene(newSet, oldSet);
            }
        }
        
        public fatalError(message : string, errorInfo : utils.IError) {
        }
    };
}
