
import ags = module(org.ags);
    
function main() {
    var parameters : ags.StageParameters = new ags.StageParameters();
    
    ags.parseQueryString(undefined, parameters);
    return new ags.Stage(parameters);
}

main();
