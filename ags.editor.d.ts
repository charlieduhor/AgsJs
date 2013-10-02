declare module org.ags.editor {
    interface IFileBrowserDelegate {
        onFileSelected(path: string): void;
    }
    class FileBrowser {
        public root: boolean;
        public path: string;
        constructor(pageNode: JQuery);
    }
}
declare module org.ags.editor {
    class Registry {
        static engineClasses: string[];
        static addEngineClass(className: string): void;
        static getEngineClasses(): string[];
    }
}
declare module org.ags.editor {
    class Stage extends ags.engine.Stage {
        constructor(parameters: ags.engine.StageParameters);
    }
}
declare function EditorMain(): org.ags.editor.Stage;
