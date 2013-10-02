
function EditorMain() {
    var parameters : org.ags.engine.StageParameters = new org.ags.engine.StageParameters();
    
    org.ags.utils.QueryString.parse(undefined, parameters);
    return new org.ags.editor.Stage(parameters);
}

$(document).bind("pagebeforecreate", function(event) {
    console.log("Editor Initialized");
    
    var pageNode   : JQuery = $(event.target);
    var parameters : org.ags.engine.StageParameters = new org.ags.engine.StageParameters();
    
    org.ags.utils.QueryString.parse(pageNode.attr("data-url"), parameters);
    
    $("#file-browser-frame", pageNode).attr("src", "editor-file-browser.html?root=true&path=Games/" + parameters.game);
});
