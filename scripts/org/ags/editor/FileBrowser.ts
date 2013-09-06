
"use strict";

module org.ags.editor {
    export interface IFileBrowserDelegate {
        onFileSelected(path : string) : void;
    }
    
    var fileBrowserDelegate : IFileBrowserDelegate;
}

function FileBrowserMain() {
}
