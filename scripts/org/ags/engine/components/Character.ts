
"use strict";

module org.ags.engine.components {
    export class Character extends Sprite implements IDrawableComponent, IUpdatableComponent {
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
    }
}
