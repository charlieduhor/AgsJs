
"use strict";

module org.ags.engine.components {
    enum DirectionMap {
        right = <number>KeyEvent.DOM_VK_RIGHT,
        left  = <number>KeyEvent.DOM_VK_LEFT,
        up    = <number>KeyEvent.DOM_VK_UP,
        down  = <number>KeyEvent.DOM_VK_DOWN
    }
    
    export class Character extends Sprite implements IDrawableComponent, IUpdatableComponent, IEventComponent {
        private direction : string;
        public  loops     : ILoop[];

        public getDirection() : string {
            return this.direction;
        }

        public setDirection(feedback : IUpdateFeedback, direction : string) {
            if (this.direction === direction) {
                return;
            }
            
            this.direction = direction;
            this.setLoop(feedback, this.loops[direction]);
        }

        public update(feedback : IUpdateFeedback) {
            super.update(feedback);
        }
        
        public deserialized() {
            if (this.direction !== undefined) {
                this.setLoop(undefined, this.loops[this.direction]);
            }
        }
        
        public handleEvent(feedback : IUpdateFeedback, event : Event) : bool {
            if (event.type === "keydown") {
                var direction = DirectionMap[(<KeyboardEvent>event).keyCode];
                
                if (direction !== undefined) {
                    this.setDirection(feedback, direction);
                }
            }
            
            return false;
        }
    }
}
