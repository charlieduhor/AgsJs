declare module org.ags.utils {
    interface IError {
        errorString: string;
        errorCode: number;
        toString(): string;
    }
    interface ILoadError extends IError {
        url: string;
    }
    class Error implements IError {
        public errorCode: number;
        public errorString: string;
        constructor(errorCode: number, errorString: string);
        public toString(): string;
        static __HIDE_IN_EDITOR__: boolean;
    }
}
declare module org.ags.utils {
    class Guid {
        public create(): string;
    }
}
declare module org.ags.utils {
    interface IJSONDeserializerDelegate extends utils.ILoader {
        progress(percent: number);
        finished();
        error(error: utils.IError): any;
        createObject(loader: JSONDeserializer, className: string, objectInfo: {}): any;
        postProcess(loader: JSONDeserializer, basePath: string, classObject: any, objectInfo: {}): boolean;
    }
    class JSONDeserializer {
        private loadingResources;
        private loadingBytes;
        private totalBytes;
        private delegate;
        private map;
        private postProcess;
        constructor(delegate: IJSONDeserializerDelegate);
        private resourceLoadProcessed(bytes);
        private resourceLoadSuccess(bytes);
        private resourceLoadFailed(bytes, error);
        private loadImage(basePath, objectInfo);
        private loadObject(basePath, objectInfo, id, postProcess);
        private loadObjectProperties(basePath, o, values);
        public loadProperty(basePath: string, propValue: any): any;
        static isReservedProperty(name: string): boolean;
        static isReservedObjectID(id: string): boolean;
        private createObjects(basePath, data);
        private createObjectProperties();
        public load(url: string): void;
        public loadScript(url: string): HTMLScriptElement;
    }
}
declare module org.ags.utils {
    interface ILoader {
        loadImage(url: string, callbackSuccess: (image: HTMLImageElement, url?: string) => any, callbackFail: (error: utils.ILoadError) => any): HTMLImageElement;
        loadScript(url: string, callbackSuccess: (script: HTMLScriptElement, url?: string) => any, callbackFail: (error: utils.ILoadError) => any): HTMLScriptElement;
        loadData(url: string, dataProcessor?: (data: any) => any): any;
        loadJson(url: string): any;
        loadDataAsync(url: string, callbackSuccess: (data: any, url: string) => any, callbackFail: (error: utils.ILoadError) => any, dataProcessor?: (data: any) => any): XMLHttpRequest;
        loadJsonAsync(url: string, callbackSuccess: (data: any, url: string) => any, callbackFail: (error: utils.ILoadError) => any): XMLHttpRequest;
    }
    class LoadError implements utils.ILoadError {
        public loadErrorCode: number;
        public loadErrorString: string;
        public loadUrl: string;
        public errorCode: number;
        public errorString: string;
        public url: string;
        constructor(errorCode: number, errorString: string, url: string);
        public toString(): string;
    }
    class Loader implements ILoader {
        private baseUrl;
        constructor(baseUrl: string);
        public loadImage(url: string, callbackSuccess: (image: HTMLImageElement, url?: string) => any, callbackFail: (error: utils.ILoadError) => any): HTMLImageElement;
        public loadScript(url: string, callbackSuccess: (script: HTMLScriptElement, url?: string) => any, callbackFail: (error: utils.ILoadError) => any): HTMLScriptElement;
        public loadDataAsync(url: string, callbackSuccess: (data: any, url: string) => any, callbackFail: (error: utils.ILoadError) => any, dataProcessor?: (data: any) => any): XMLHttpRequest;
        public loadData(url: string, dataProcessor?: (data: any) => any): any;
        public loadJson(url: string): any;
        public loadJsonAsync(url: string, callbackSuccess: (data: any, url: string) => any, callbackFail: (error: utils.ILoadError) => any): XMLHttpRequest;
    }
}
declare module org.ags.utils {
    class Log {
        static info(s: string, ...args: any[]): void;
        static error(s: string, ...args: any[]): void;
        static warning(s: string, ...args: any[]): void;
    }
}
declare module org.ags.utils {
    interface IOrderable {
        order: number;
    }
    class OrderedComponents<T extends IOrderable> {
        public components: T[];
        constructor();
        public add(component: T): number;
        private _add(component, b1, b2);
        public debugOrders(): string;
        public reorder(): void;
    }
}
declare module org.ags.utils {
    class Path {
        static dirname(url: string): string;
        static simplify(u1: string): string;
        static join(u1: string, u2: string): string;
        static getBasePath(): string;
    }
}
declare module org.ags.utils {
    class QueryString {
        static parse(queryString?: string, urlParams?): {};
    }
}
interface String {
    vformat(args: any[]): string;
    format(...args: any[]): string;
    startsWith(s: string): boolean;
    endsWith(s: string): boolean;
}
