
"use strict";

module org.ags.engine.components {
    enum DirectionMap {
        right = <number>KeyEvent.DOM_VK_RIGHT,
        left  = <number>KeyEvent.DOM_VK_LEFT,
        up    = <number>KeyEvent.DOM_VK_UP,
        down  = <number>KeyEvent.DOM_VK_DOWN
    }
    
    export class Character extends Sprite implements IDrawableComponent, IUpdatableComponent, IEventComponent {
        private _direction : string;
        public  loops      : ILoop[];

        public get direction() : string {
            return this._direction;
        }

        public set direction(direction : string) {
            if (this._direction === direction) {
                return;
            }
            
            this._direction = direction;
            
            if (this.loops) {
                this.loop = this.loops[direction];
            }
        }

        public update() {
            super.update();
        }
        
        public deserialized() {
            if (this._direction !== undefined) {
                this.loop = this.loops[this._direction];
            }
        }
        
        public handleEvent(event : Event) : boolean {
            if (event.type === "keydown") {
                var direction = DirectionMap[(<KeyboardEvent>event).keyCode];
                
                if (direction !== undefined) {
                    this.direction = direction;
                }
            }
            
            return false;
        }
    }
}
