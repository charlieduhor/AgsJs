
module org.ags.editor {
    export class Registry {
        public static engineClasses : string[] = [];

        public static addEngineClass(className : string) {
            engineClasses.push(className);
        }

        public static getEngineClasses() : string[] {
            return engineClasses;
        }
    }
}
