
"use strict";

module org.ags.engine {
    export interface ICell {
        drawCanvas(context : CanvasRenderingContext2D, x : number, y : number);
        hitTest(drawX : number, drawY : number, hitX : number, hitY : number) : number;
    }

    export class Cell implements ICell {
        public image   : HTMLImageElement;
        public centerX : number = 0;
        public centerY : number = 0;
        
        public drawCanvas(context : CanvasRenderingContext2D, x : number, y : number) {
            context.drawImage(this.image, x - this.centerX, y - this.centerY);
        }
        
        public hitTest(drawX : number, drawY : number, hitX : number, hitY : number) : number {
            var x1 : number = drawX - this.centerX;
            
            if (hitX < x1) {
                // No hit.
                return 0;
            }
            
            var y1 : number = drawY - this.centerY;

            if (hitY < y1) {
                // No hit.
                return 0;
            }

            var x2 : number = x1 + this.image.width;
            
            if (hitX >= y2) {
                // No hit.
                return 0;
            }
            
            var y2 : number = y1 + this.image.height;
            
            if (hitY >= y2) {
                // No hit.
                return 0;
            }
            
            return 1;
        }
    }
}
