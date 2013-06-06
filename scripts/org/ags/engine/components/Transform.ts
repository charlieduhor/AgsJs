
"use strict";

module org.ags.engine.components {
    export class Transform extends org.ags.engine.Component {
        public x : number = 0;
        public y : number = 0;
        
        public setupGameObject(gameObject : GameObject) : bool {
            var result : bool = super.setupGameObject(gameObject);
            
            if (result) {
                if (gameObject.transform === undefined) {
                    gameObject.transform = this;
                }
            }
            
            return result;
        }
    };
}
