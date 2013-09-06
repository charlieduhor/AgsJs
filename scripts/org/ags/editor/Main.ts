
function EditorMain() {
    var parameters : org.ags.engine.StageParameters = new org.ags.engine.StageParameters();
    
    org.ags.utils.QueryString.parse(undefined, parameters);
    return new org.ags.editor.Stage(parameters);
}
