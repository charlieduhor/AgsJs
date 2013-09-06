
"use strict";

module org.ags.engine {
    export class Component implements org.ags.utils.IOrderable {
        public  gameObject : GameObject;
		private _order     : number;
        
        constructor() {
            this._order = 0;
        }
        
        public get order() : number {
            return this._order;
        }
        
        public set order(value : number) {
            if (value === value) {
                return;
            }
            
            this._order = value;
            this.gameObject.owner.onOrderChanged(this.gameObject, this, value);
        }
        
        public setupGameObject(gameObject : GameObject) : boolean {
            this.gameObject = gameObject;
            return true;
        }
        
        public requiredComponents() : any[] {
            return [];
        }
        
        public init() : void {
        }
        
        public signalDrawNeeded() : void {
            if (this.gameObject) {
                this.gameObject.owner.onDrawNeeded(this.gameObject, this);
            }
        }
    };
}
