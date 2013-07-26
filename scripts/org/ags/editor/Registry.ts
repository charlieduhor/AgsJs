
module org.ags.editor {
    export class Registry {
        public static engineClasses : string[] = [];

        public static addEngineClass(className : string) {
            Registry.engineClasses.push(className);
        }

        public static getEngineClasses() : string[] {
            return Registry.engineClasses;
        }
    }
}
