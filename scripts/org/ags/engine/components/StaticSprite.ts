
"use strict";

module org.ags.engine.components {
    export class StaticSprite extends Component implements IDrawableComponent {
        public cell : Cell;
        
    	drawCanvas(context : CanvasRenderingContext2D) {
            var cell : Cell = this.cell;
            
            if (cell) {
                var transform : Transform = this.gameObject.transform;
                
                cell.drawCanvas(context, transform.x, transform.y);
            }
    	}
        
        public requiredComponents() : any[] {
            return [ org.ags.engine.components.Transform ];
        }
    };
}
