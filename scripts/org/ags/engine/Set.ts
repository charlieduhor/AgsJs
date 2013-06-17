
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
    };
}
