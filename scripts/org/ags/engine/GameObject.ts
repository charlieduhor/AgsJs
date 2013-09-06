
"use strict";

module org.ags.engine {
    export class GameObject {
        public owner      : org.ags.engine.Set;
        public _parent    : GameObject;
        public name       : string;
        public components : Component[] = [];
        public transform  : org.ags.engine.components.Transform;
        
        constructor(owner : Set, parent : GameObject, name : string) {
            this.owner   = owner;
            this.name    = name;
            this._parent = parent;
        }
        
        public get parent() : GameObject {
            return this._parent;
        }        
        
        public set parent(value : GameObject) {
            if (this._parent === value) {
                return;
            }
            
            this._parent = value;
            this.owner.onParentChanged(this, value);
        }
        
        public get stage() : Stage {
            return this.owner.stage;
        }
        
        public hasComponent(componentClass : any) : boolean {
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
            
            this.owner.onComponentAdded(this, component);
        }
    };
}
