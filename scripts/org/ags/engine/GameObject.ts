
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
        
        public addComponent(component : Component) {
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
