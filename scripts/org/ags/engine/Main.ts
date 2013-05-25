
import ags = module(org.ags.engine);
    
function EngineMain() {
    var parameters : ags.StageParameters = new ags.StageParameters();
    
    ags.parseQueryString(undefined, parameters);
    return new ags.Stage(parameters);
}
