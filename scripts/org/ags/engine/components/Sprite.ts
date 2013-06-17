
"use strict";

module org.ags.engine.components {
    export class Sprite extends Component implements IDrawableComponent {
        public loop    : ILoop;
        public loopRun : IRunLoop;
        public cell    : ICell;
        
        drawCanvas(context : CanvasRenderingContext2D) {
            var cell : ICell = this.cell;
            
            if (cell) {
                var transform : Transform = this.gameObject.transform;
                
                cell.drawCanvas(context, transform.x, transform.y);
            }
    	}
        
        public requiredComponents() : any[] {
            return [ org.ags.engine.components.Transform ];
        }
        
        public update() {
            if (this.loopRun === undefined) {
                if (this.loop) {
                    this.loopRun = this.loop.run();
                }
            }
            
            if (this.loopRun) {
                this.cell = this.loopRun.next();
            }
        }
    };
}
