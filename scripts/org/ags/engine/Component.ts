
"use strict";

module org.ags.engine {
    export class Component implements IOrderableComponent {
		public order : number;
        
        constructor() {
            this.order = 0;
        }
    };
}
