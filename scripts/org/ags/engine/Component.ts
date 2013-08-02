
"use strict";

module org.ags.engine {
    export class Component implements IOrderable {
        public gameObject : GameObject;
		public order      : number;
        
        constructor() {
            this.order = 0;
        }
        
        public setupGameObject(gameObject : GameObject) : bool {
            this.gameObject = gameObject;
            return true;
        }
        
        public requiredComponents() : any[] {
            return [];
        }
        
        public init() {
        }
    };
}
