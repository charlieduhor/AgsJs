
"use strict";

module org.ags.engine {
    export class Set {
        public updatableComponents : OrderedComponents<IUpdatableComponent> = new OrderedComponents<IUpdatableComponent>();
        public drawableComponents  : OrderedComponents<IDrawableComponent>  = new OrderedComponents<IDrawableComponent>();
        public eventComponents     : OrderedComponents<IEventComponent>     = new OrderedComponents<IEventComponent>();
        
        public gameObjects : org.ags.engine.GameObject[] = [];
        
        public stage       : Stage;
        public name        : string;
        public sceneScript : IScene;
        
        private drawNeeded   : bool = true;
        private orderChanged : bool = true;
        
        constructor(stage : Stage, name : string) {
            this.stage = stage;
            this.name  = name;
        }
        
        public createGameObject(name : string, parent? : GameObject) : GameObject {
            var go       : GameObject = new GameObject(this, parent, name);
            var newIndex : number     = this.gameObjects.length;
            
            this.gameObjects[newIndex] = go;
            return go;
        }

        private performReorder() {
            this.orderChanged = false;
            this.drawNeeded   = true;
            
            this.updatableComponents.reorder();
            this.drawableComponents.reorder();
            this.eventComponents.reorder();
        }

        public loop() {
            var index : number, count : number;
            
            // Updates
            var updates : IUpdatableComponent[] = this.updatableComponents.components;
            
            count = updates.length;
            for (index = 0; index < count; index++) {
                updates[index].update();
            }
            
            if (this.orderChanged) {
                this.performReorder();
            }
            
            if (this.drawNeeded) {
                this.drawNeeded = false;
                
                // Drawable
                var drawables   : IDrawableComponent[]     = this.drawableComponents.components;
                var drawContext : CanvasRenderingContext2D = this.stage.canvasContext;
                
                count = drawables.length;
                for (index = 0; index < count; index++) {
                    drawables[index].drawCanvas(drawContext);
                }
            }
        }
        
        public dispatchEvent(ev : Event) {
            var index    : number, count : number;
            var ec       : OrderedComponents<IEventComponent> = this.eventComponents;
            
            count = ec.components.length;
            for (index = 0; index < count; index++) {
                if (ec.components[index].handleEvent(ev)) {
                    break;
                }
            }
        }
        
        public onParentChanged(go : GameObject, newParent : GameObject) {
            // When parent changes, the drawing order might change...
            this.orderChanged = true;
        }
        
        public onComponentAdded(go : GameObject, component : Component) : void {
            var m = component["drawCanvas"];
            
            if (m !== undefined) {
                if (typeof m === "function") {
                    this.drawableComponents.add(<IDrawableComponent><any>component);
                }
            }
            
            m = component["update"];
            
            if (m !== undefined) {
                if (typeof m === "function") {
                    this.updatableComponents.add(<IUpdatableComponent><any>component);
                }
            }
            
            m = component["handleEvent"];
            
            if (m !== undefined) {
                if (typeof m === "function") {
                    this.eventComponents.add(<IEventComponent><any>component);
                }
            }
        }
        
        public onOrderChanged(go : GameObject, component : Component, order : number) {
            this.orderChanged = true;
        }
        
        public onDrawNeeded(go : GameObject, component : Component) {
            this.drawNeeded = true;
        }
    };
}
