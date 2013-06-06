
"use strict";

module org.ags.engine {
    export class GameObject {
        public stage      : org.ags.engine.Stage;
        public name       : string;
        public components : Component[] = [];
        public transform  : org.ags.engine.components.Transform;
        
        constructor(stage : Stage, name : string) {
            this.stage = stage;
            this.name  = name;
        }
        
        public hasComponent(componentClass : any) : bool {
            var index, count = this.components.length;
            
            for (index = 0; index < count; index++) {
                var component : any = this.components[index];
                
                if (component instanceof componentClass) {
                    return true;
                }
            }
            
            return false;
        }
        
        public addComponentByClass(componentClass : any) : Component {
            var component : Component = new componentClass();
            
            this.addComponent(component);
            return component;
        }
        
        public ensureHasComponents(requiredComponents : any[]) {
            var index : number;
            var count : number = requiredComponents.length;
            
            for (index = 0; index < count; index++) {
                if (!this.hasComponent(requiredComponents[index])) {
                    this.addComponentByClass(requiredComponents[index]);
                }
            }
        }
        
        public addComponent(component : Component) {
            this.ensureHasComponents(component.requiredComponents());
            
            if (!component.setupGameObject(this)) {
                return;
            }
            
            var newIndex = this.components.length;
            
            this.components.length    = newIndex + 1;
            this.components[newIndex] = component;
            
            var m = component["drawCanvas"];
            
            if (m !== undefined) {
                if (typeof m === "function") {
                    this.stage.drawableComponents.add(component);
                }
            }
            
            m = component["update"];
            
            if (m !== undefined) {
                if (m === "function") {
                    this.stage.updatableComponents.add(component);
                }
            }
        }
    };
}
