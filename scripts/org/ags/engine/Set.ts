
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
        
        private loadObject(map : {}, objectInfo : {}, id? : string, postProcess? : any[]) : any {
            var className            : string = objectInfo["className"];
            var objectImplementation : any;
            
            if (className === "org.ags.engine.GameObject") {
                objectImplementation = this.createGameObject((<ISerializedGameObject>objectInfo).name);
            }
            else {
                var classType : any = eval(className);
                
                objectImplementation = new classType();
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
                Log.error("Failed to load object {0}".format(id));
            }
            
            return objectImplementation;
        }
        
        private loadProperty(map : {}, property : any) : any {
            if (property instanceof String) {
                if (property.match("\\#[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}")) {
                    return map[property.sub(1)];
                }
            }
            else if (property instanceof Object) {
                if (property["className"] !== undefined) {
                    return this.loadObject(map, property);
                }   
            }
            
            return property;
        }
        
        public load(
            data : any,
            callbackSuccess : () => any,
            callbackFail : (error : IError) => any) {
            
            var objectID    : string;
            var objectCount : number = 0;
            
            var map         : {} = {};
            var postProcess : any[] = [];
            
            for (objectID in data) {
                if (this.loadObject(map, data[objectID], objectID, postProcess) !== undefined) {
                    objectCount++;
                }
            }
            
            if (objectCount === 0) {
                callbackFail(new Error(-1, "Scene {0} is empty.".format(this.name)));
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
            }
        }
    };
}
