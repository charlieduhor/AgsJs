
import engine = org.ags.engine;
import editor = org.ags.editor;

function EditorMain() {
    var parameters : engine.StageParameters = new engine.StageParameters();
    
    engine.Utilities.parseQueryString(undefined, parameters);
    return new editor.Stage(parameters);
}
