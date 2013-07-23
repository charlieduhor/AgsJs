
"use strict";

module org.ags.engine.components {
    export class Sprite extends Component implements IDrawableComponent {
        private loop      : ILoop;
        private loopRun   : IRunLoop;
        private cell      : ICell;
        private speedTime : number = 0;
        public  speed     : number = 0;
        public  autostart : bool   = false;
        
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
            this.loopRun = undefined;
            
            if (feedback) {
                feedback.drawNeeded = true;
            }
        }
        
        public requiredComponents() : any[] {
            return [ org.ags.engine.components.Transform ];
        }
        
        public start() {
            if (this.loopRun === undefined) {
                if (this.loop) {
                    this.loopRun   = this.loop.run();
                    this.speedTime = 0;
                }
            }
        }
        
        public update(feedback : IUpdateFeedback) {
            if (this.cell === undefined) {
                if (this.autostart === true) {
                    this.autostart = false;
                    this.start();
                }
                else {
                    if (this.loop !== undefined) {
                        var lr : IRunLoop = this.loop.run();
                        
                        if (lr) {
                            this.cell = lr.next();
                        }
                    }
                }
            }
            
            if (this.loopRun) {
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
