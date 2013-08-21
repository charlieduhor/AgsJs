
"use strict";

module org.ags.engine {
    export interface IRunLoop {
        current() : ICell;
        next() : ICell;
        move(index : number) : ICell;
    }
    
    export interface ILoop {
        run() : IRunLoop;
    }
    
    class CellRunLoop implements IRunLoop {
        public cells : ICell[];
        public index : number;
        
        constructor(cells : ICell[], index : number) {
            this.cells = cells;
            this.index = index;
        }
        
        public current() : ICell {
            return this.cells[this.index];
        }
        
        public next() : ICell {
            if (this.index < this.cells.length) {
                this.index++;
            }
            
            return this.cells[this.index];
        }
        
        public move(index : number) : ICell {
            if (index < 0) {
                this.index = 0;
            }
            else if (index >= this.cells.length) {
                this.index = this.cells.length - 1;
            }
            else {
                this.index = index;
            }
            
            return this.cells[this.index];
        }
    }

    class CellCycleRunLoop extends CellRunLoop {
        constructor(cells : ICell[], index : number) {
            super(cells, index);
        }
        
        public next() : ICell {
            this.index++;
            
            if (this.index >= this.cells.length) {
                this.index = 0;
            }
            
            return this.cells[this.index];
        }
    }

    export class CellLoop implements ILoop {
        public cells : ICell[];
        public cycle : bool;
        
        public run() : IRunLoop {
            if (this.cycle) {
                return new CellCycleRunLoop(this.cells, -1);
            }
            
            return new CellRunLoop(this.cells, -1);
        }
    }
}
