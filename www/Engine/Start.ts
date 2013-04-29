
import ags = module(org.ags);
    
function main() {
    var parameters : ags.StageParameters = new ags.StageParameters();
    
    ags.parseQueryString(undefined, parameters);
    return new ags.Stage(parameters);
}

var oc = new ags.OrderedComponents();

class TestComponent implements ags.OrderableComponent {
	public order : number;
	
	constructor(order : number) {
		this.order = order;
	}
};


oc.add(new TestComponent(0));
oc.add(new TestComponent(10));
oc.add(new TestComponent(5));
oc.add(new TestComponent(7));
oc.add(new TestComponent(1));
oc.add(new TestComponent(1));
oc.add(new TestComponent(1));
oc.add(new TestComponent(1));
oc.add(new TestComponent(2));
oc.add(new TestComponent(100));
oc.add(new TestComponent(-1));
console.log(oc.debugOrders());

main();
