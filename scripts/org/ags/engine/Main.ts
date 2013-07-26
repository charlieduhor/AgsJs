
import ags = org.ags.engine;

function EngineMain() {
    var parameters : ags.StageParameters = new ags.StageParameters();
    
    ags.Utilities.parseQueryString(undefined, parameters);
    return new ags.Stage(parameters);
}
