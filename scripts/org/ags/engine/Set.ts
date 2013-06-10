
"use strict";

module org.ags.engine {
    interface ISerializedGameObject {
        className  : string;
        name       : string;
        components : any[];
    }
    
    export class Set {
        public updatableComponents : OrderedComponents = new OrderedComponents();
        public drawableComponents  : OrderedComponents = new OrderedComponents();
        
        public gameObjects : org.ags.engine.GameObject[] = [];
        
        public stage : Stage;
        public name  : string;
        
        private loadingResources : number = 0;
        
        constructor(stage : Stage, name : string) {
            this.stage = stage;
            this.name  = name;
        }
        
        public createGameObject(name : string) : GameObject {
            var go       : GameObject = new GameObject(this, name);
            var newIndex : number     = this.gameObjects.length;
            
            this.gameObjects[newIndex] = go;
            return go;
        }

        public loop() {
            var index : number, count : number;
            
            // Updates
            var updates : IUpdatableComponent[] = <IUpdatableComponent[]>this.updatableComponents.components;
            
            count = updates.length;
            for (index = 0; index < count; index++) {
                updates[index].update();
            }
            
            // Drawable
            var drawables   : IDrawableComponent[]     = <IDrawableComponent[]>this.drawableComponents.components;
            var drawContext : CanvasRenderingContext2D = this.stage.canvasContext;
            
            count = drawables.length;
            for (index = 0; index < count; index++) {
                drawables[index].drawCanvas(drawContext);
            }
        }

        private loadCallbackSuccess : () => any;
        
        private resourceLoadProcessed() {
            this.loadingResources--;
            
            if ((this.loadingResources    === 0) &&
                (this.loadCallbackSuccess !== undefined)) {
                    
                this.loadCallbackSuccess();
                delete this.loadCallbackSuccess;
            }
        }
            
        private resourceLoadSuccess() {
            this.resourceLoadProcessed();
        }
        
        private resourceLoadFailed(error : IError) {
            Log.error(error.toString());
            this.resourceLoadProcessed();
        }
        
        private loadObject(map : {}, objectInfo : {}, id? : string, postProcess? : any[]) : any {
            var className            : string = objectInfo["className"];
            var objectImplementation : any;
            
            if (className === "org.ags.engine.GameObject") {
                objectImplementation = this.createGameObject((<ISerializedGameObject>objectInfo).name);
            }
            else if (className === "HTMLImageElement") {
                var that = this;
                
                objectImplementation = this.stage.loadImage(
                    objectInfo["url"],
                    function () {
                        that.resourceLoadSuccess();
                    },
                    function (error : IError) {
                        that.resourceLoadFailed(error);
                    });
                    
                this.loadingResources++;
            }
            else {
                var classType : any = eval(className);
                
                try {
                    objectImplementation = new classType();
                }
                catch (e) {
                    Log.error("Failed to create object of type {0}. {1}".format(className, e));
                }
            }
            
            if (objectImplementation !== undefined) {
                if (id !== undefined) {
                    map[id] = objectImplementation;
                }
                
                if (postProcess !== undefined) {
                    postProcess.push([objectImplementation, objectInfo]);
                }
            }
            else {
                Log.error("Failed to create object of type {0}. Constructor returned 'undefined'".format(className));
            }
            
            return objectImplementation;
        }
        
        private loadObjectProperties(map : {}, o : {}, values : {}) {
            for (var key in values) {
                if (Set.isReservedProperty(key)) {
                    continue;
                }
                
                o[key] = this.loadProperty(map, values[key]);
            }
            
            var deserialized = o["deserialized"];
            
            if (deserialized instanceof Function) {
                deserialized.call(o);
            }
        }
        
        private loadProperty(map : {}, propValue : any) : any {
            if (propValue instanceof String) {
                if (propValue.match("\\#[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}")) {
                    return map[propValue.sub(1)];
                }
            }
            else if (propValue instanceof Object) {
                var newObject;
                
                if (propValue["className"] !== undefined) {
                    newObject = this.loadObject(map, propValue);
                }
                else {
                    newObject = {};
                }
                
                this.loadObjectProperties(map, newObject, propValue);
                return newObject;
            }
            else if (propValue instanceof Array) {
                var newArray = [];
                
                for (var index in propValue) {
                    newArray[index] = this.loadProperty(map, propValue[index]);
                }
                
                return newArray;
            }
            
            return propValue;
        }

        public static isReservedProperty(name : string) : bool {
            return name === "className";
        }
        
        public load(
            data            : any,
            callbackSuccess : () => any,
            callbackFail    : (error : IError) => any) {
            
            var objectID    : string;
            var objectCount : number = 0;
            
            var map         : {} = {};
            var postProcess : any[] = [];
            
            this.loadingResources++;
            
            try {
                for (objectID in data) {
                    if (this.loadObject(map, data[objectID], objectID, postProcess) !== undefined) {
                        objectCount++;
                    }
                }
                
                if (objectCount === 0) {
                    callbackFail(new Error(-1, "Scene {0} is empty.".format(this.name)));
                    this.loadingResources--;
                    return;
                }
                
                for (var index in postProcess) {
                    var post = postProcess[index];
                    
                    if (post[0] instanceof GameObject) {
                        var sgo = <ISerializedGameObject>post[1];
                        
                        for (var componentIndex in sgo.components) {
                            post[0].addComponent(this.loadProperty(map, sgo.components[componentIndex]));
                        }
                    }
                    else {
                        this.loadObjectProperties(map, post[0], post[1]);
                    }
                }
                
                this.loadCallbackSuccess = callbackSuccess;
                
                // If no object requires post processing, just 
                this.resourceLoadSuccess();
            }
            catch (e) {
                this.loadingResources--;
                throw e;
            }
        }
    };
}
