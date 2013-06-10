
"use strict";

module org.ags.engine {
    export interface ICell {
        drawCanvas(context : CanvasRenderingContext2D, x : number, y : number);
        hitTest(drawX : number, drawY : number, hitX : number, hitY : number) : number;
    }

    export class Cell implements ICell {
        private image       : HTMLImageElement;
        private imageX      : number;
        private imageY      : number;
        private imageWidth  : number;
        private imageHeight : number;
        private centerX     : number;
        private centerY     : number;
        
        constructor(image : HTMLImageElement, imageX : number, imageY : number, imageWidth : number, imageHeight : number, centerX : number, centerY : number) {
            this.image       = image;
            this.imageX      = imageX;
            this.imageY      = imageY;
            this.imageWidth  = imageWidth;
            this.imageHeight = imageHeight;
            this.centerX     = centerX;
            this.centerY     = centerY;
        }
        
        public drawCanvas(context : CanvasRenderingContext2D, x : number, y : number) {
            var iw : number = this.imageWidth;
            var ih : number = this.imageHeight;
            
            context.drawImage(
                this.image,
                
                // Output
                x - this.centerX,
                y - this.centerY,
                iw,
                ih,
                
                // Input
                this.imageX,
                this.imageY,
                iw,
                ih);
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
        
        public deserialized() {
            console.log(this.image);
        }
    }
}
