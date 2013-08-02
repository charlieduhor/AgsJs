
"use strict";

module org.ags.engine.components {
    export class Sprite extends Component implements IDrawableComponent {
        private loop      : ILoop;
        private loopRun   : IRunLoop;
        private cell      : ICell;
        private speedTime : number = 0;
        public  speed     : number = 0;
        public  running   : bool   = false;
        
        drawCanvas(context : CanvasRenderingContext2D) {
            var cell : ICell = this.cell;
            
            if (cell) {
                var transform : Transform = this.gameObject.transform;
                
                cell.drawCanvas(context, transform.x, transform.y);
            }
    	}
        
        public getLoop() : ILoop {
            return this.loop;
        }
        
        public setLoop(feedback : IUpdateFeedback, newLoop : ILoop) {
            if (this.loop === newLoop) {
                return;
            }
            
            this.loop    = newLoop;
            this.cell    = undefined;
            this.loopRun = undefined;
            
            if (feedback) {
                feedback.drawNeeded = true;
            }
        }
        
        public requiredComponents() : any[] {
            return [ org.ags.engine.components.Transform ];
        }
        
        public update(feedback : IUpdateFeedback) {
            if (this.loopRun === undefined && this.loop) {
                this.loopRun   = this.loop.run();
                this.speedTime = 0;
            }
            
            if (this.cell === undefined && !this.running) {
                if (this.loopRun) {
                    this.cell = this.loopRun.next();
                }
            }
            
            if (this.loopRun && this.running) {
                if (this.speedTime <= 1) {
                    this.cell      = this.loopRun.next();
                    this.speedTime = this.speed;
                }
                else {
                    this.speedTime--;
                }
                
                feedback.drawNeeded = true;
            }
        }
    };
}
