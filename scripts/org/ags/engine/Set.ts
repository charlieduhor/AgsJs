
"use strict";

module org.ags.engine {
    class UpdateFeedback implements IUpdateFeedback {
        public drawNeeded   : bool = true;
        public orderChanged : bool = true;
    };
    
    export class Set {
        public updatableComponents : OrderedComponents<IUpdatableComponent> = new OrderedComponents<IUpdatableComponent>();
        public drawableComponents  : OrderedComponents<IDrawableComponent>  = new OrderedComponents<IDrawableComponent>();
        public eventComponents     : OrderedComponents<IEventComponent>     = new OrderedComponents<IEventComponent>();
        
        public gameObjects : org.ags.engine.GameObject[] = [];
        
        public stage       : Stage;
        public name        : string;
        public sceneScript : IScene;
        
        private feedback : IUpdateFeedback = new UpdateFeedback();
        
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

        private performReorder() {
            this.feedback.orderChanged = false;
            this.feedback.drawNeeded   = true;
            
            this.updatableComponents.reorder();
            this.drawableComponents.reorder();
            this.eventComponents.reorder();
        }

        public loop() {
            var feedback : IUpdateFeedback = this.feedback;
            var index    : number, count : number;
            
            // Updates
            var updates : IUpdatableComponent[] = this.updatableComponents.components;
            
            count = updates.length;
            for (index = 0; index < count; index++) {
                updates[index].update(feedback);
            }
            
            if (feedback.orderChanged) {
                this.performReorder();
            }
            
            if (feedback.drawNeeded) {
                feedback.drawNeeded = false;
                
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
            var feedback : IUpdateFeedback                    = this.feedback;
            
            count = ec.components.length;
            for (index = 0; index < count; index++) {
                if (ec.components[index].handleEvent(feedback, ev)) {
                    break;
                }
            }
            
            if (feedback.orderChanged) {
                this.performReorder();
            }
        }
    };
}
