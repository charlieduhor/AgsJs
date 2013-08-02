
module org.ags.engine {
	export interface IOrderable {
		order : number;
	};
	
	export class OrderedComponents<T extends IOrderable> {
		public components : T[];
	
		constructor() {
			this.components = [];
		}
	
		public add(component : T) : number {
			if (this.components.length == 0) {
				this.components[0] = component;
				return 0;
			}
			
			return this._add(component, 0, this.components.length - 1);
		}
		
		private _add(component : T, b1 : number, b2 : number) : number {
			var i : number = Math.floor(b1 + ((b2 - b1) / 2));
			
			if (this.components[i].order <= component.order) {
				if (i == b1) {
					if (i == b2) {
						this.components.splice(i + 1, 0, component);
						return i + 1;
					}
					
					i++;
				}
			
				return this._add(component, i, b2);
			}
			else {
				if (i == b2) {
					if (i == b1) {
						this.components.splice(i, 0, component);
						return i;
					}
					
					i--;
				}
				
				return this._add(component, b1, i);
			}
		}
		
		public debugOrders() : string {
			var s = "";
			var i, count = this.components.length;
		
			for (i = 0; i < count; i++) {
				s += this.components[i].order.toString();
				s += ",";
			}
			
			return s;
		}
        
        public reorder() {
            this.components.sort(function(o1 : IOrderable, o2 : IOrderable) {
                return o1.order - o2.order;
            });
        }
	};
};
