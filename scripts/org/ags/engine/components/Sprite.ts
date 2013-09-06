
"use strict";

module org.ags.engine.components {
    export class Sprite extends Component implements IDrawableComponent {
        private _loop     : ILoop;
        private loopRun   : IRunLoop;
        private cell      : ICell;
        private step      : number  = 0;
        public  speed     : number  = 0;
        public  running   : boolean = false;
        
        public drawCanvas(context : CanvasRenderingContext2D) {
            var cell : ICell = this.cell;
            
            if (cell) {
                var transform : Transform = this.gameObject.transform;
                
                cell.drawCanvas(context, transform.x, transform.y);
            }
    	}
        
        public get loop() : ILoop {
            return this._loop;
        }
        
        public set loop(newLoop : ILoop) {
            if (this._loop === newLoop) {
                return;
            }
            
            this._loop   = newLoop;
            this.cell    = undefined;
            this.loopRun = undefined;
            this.signalDrawNeeded();
        }
        
        public requiredComponents() : any[] {
            return [ org.ags.engine.components.Transform ];
        }
        
        public update() : void {
            if (this.loopRun === undefined && this._loop) {
                this.loopRun = this._loop.run();
                this.step    = 0;
            }
            
            if (this.cell === undefined && !this.running) {
                if (this.loopRun) {
                    this.cell = this.loopRun.next();
                }
            }
            
            if (this.loopRun && this.running) {
                if (this.step <= 1) {
                    this.cell = this.loopRun.next();
                    this.step = this.speed;
                }
                else {
                    this.step--;
                }
                
                this.signalDrawNeeded();
            }
        }
    };
}
