
"use strict";

module org.ags.engine.components {
    export class Transform extends org.ags.engine.Component {
        private _x : number = 0;
        private _y : number = 0;
        
        public get x() : number {
            return this._x;
        }
        
        public set x(n : number) {
            if (this._x === n) {
                return;
            }
            
            this._x = n;
            this.signalDrawNeeded();
        }

        public get y() : number {
            return this._y;
        }

        public set y(n : number) {
            if (this._y === n) {
                return;
            }
            
            this._y = n;
            this.signalDrawNeeded();
        }
        
        public setPosition(nx : number, ny : number) : void {
            if (this._x === nx && this._y === ny) {
                return;
            }
            
            this._x = nx;
            this._y = ny;
            this.signalDrawNeeded();
        }

        public move(nx : number, ny : number) : void {
            if (nx === 0 && ny === 0) {
                return;
            }
            
            this._x += nx;
            this._y += ny;
            this.signalDrawNeeded();
        }

        public setupGameObject(gameObject : GameObject) : boolean {
            var result : boolean = super.setupGameObject(gameObject);
            
            if (result) {
                if (gameObject.transform === undefined) {
                    gameObject.transform = this;
                }
            }
            
            return result;
        }
    };
}
