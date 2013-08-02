interface String {
    vformat(args: any[]): string;
    format(...args: any[]): string;
    startsWith(s: string): boolean;
    endsWith(s: string): boolean;
}
declare module org.ags.engine {
    class Path {
        static dirname(url: string): string;
        static simplify(u1: string): string;
        static join(u1: string, u2: string): string;
    }
    class Utilities {
        static getBasePath(): string;
        static parseQueryString(queryString?: string, urlParams?): {};
        static guid(): string;
    }
}
declare module org.ags.engine {
    class Log {
        static info(s: string, ...args: any[]): void;
        static error(s: string, ...args: any[]): void;
        static warning(s: string, ...args: any[]): void;
    }
}
declare module org.ags.engine {
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
declare module org.ags.engine {
    enum KeyEvent {
        DOM_VK_LEFT,
        DOM_VK_UP,
        DOM_VK_RIGHT,
        DOM_VK_DOWN,
    }
    class EventHandler {
        public next: any;
        static add(eh: EventHandler, peh: EventHandler): EventHandler;
        static remove(eh: EventHandler, peh: EventHandler): EventHandler;
    }
}
declare module org.ags.engine {
    interface IOrderable {
        order: number;
    }
    class OrderedComponents<T extends org.ags.engine.IOrderable> {
        public components: T[];
        constructor();
        public add(component: T): number;
        private _add(component, b1, b2);
        public debugOrders(): string;
        public reorder(): void;
    }
}
declare module org.ags.engine {
    interface ICell {
        drawCanvas(context: CanvasRenderingContext2D, x: number, y: number);
        hitTest(drawX: number, drawY: number, hitX: number, hitY: number): number;
    }
    class Cell implements ICell {
        private image;
        private imageX;
        private imageY;
        private imageWidth;
        private imageHeight;
        private centerX;
        private centerY;
        constructor(image: HTMLImageElement, imageX: number, imageY: number, imageWidth: number, imageHeight: number, centerX: number, centerY: number);
        public drawCanvas(context: CanvasRenderingContext2D, x: number, y: number): void;
        public hitTest(drawX: number, drawY: number, hitX: number, hitY: number): number;
        public deserialized(): void;
    }
}
declare module org.ags.engine {
    interface ILoaderDelegate {
        loadJsonAsync(url: string, callbackSuccess: (data: any, url: string) => any, callbackFail: (error: engine.ILoadError) => any): XMLHttpRequest;
        progress(percent: number);
        finished();
        error(error: engine.IError): any;
        createObject(loader: Loader, className: string, objectInfo: {}): any;
        createImage(url: string, callbackSuccess: (image: HTMLImageElement, url?: string) => any, callbackFail: (error: engine.ILoadError) => any): HTMLImageElement;
        createScript(url: string, callbackSuccess: (image: HTMLScriptElement, url?: string) => any, callbackFail: (error: engine.ILoadError) => any): HTMLScriptElement;
        postProcess(loader: Loader, basePath: string, classObject: any, objectInfo: {}): boolean;
    }
    class Loader {
        private loadingResources;
        private loadingBytes;
        private totalBytes;
        private delegate;
        private map;
        private postProcess;
        constructor(delegate: ILoaderDelegate);
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
declare module org.ags.engine {
    interface IRunLoop {
        current(): engine.ICell;
        next(): engine.ICell;
    }
    interface ILoop {
        run(): IRunLoop;
    }
    class CellLoop implements ILoop {
        public cells: engine.ICell[];
        public cycle: boolean;
        public run(): IRunLoop;
    }
}
declare module org.ags.engine {
    class Component implements engine.IOrderable {
        public gameObject: engine.GameObject;
        public order: number;
        constructor();
        public setupGameObject(gameObject: engine.GameObject): boolean;
        public requiredComponents(): any[];
        public init(): void;
    }
}
declare module org.ags.engine {
    class GameObject {
        public owner: engine.Set;
        public name: string;
        public components: engine.Component[];
        public transform: engine.components.Transform;
        constructor(owner: engine.Set, name: string);
        public stage : engine.Stage;
        public hasComponent(componentClass: any): boolean;
        public addComponentByClass(componentClass: any): engine.Component;
        public ensureHasComponents(requiredComponents: any[]): void;
        public addComponent(component: engine.Component): void;
    }
}
declare module org.ags.engine {
    interface IScene {
        onAboutToEnterScene(newSet: engine.Set, previousSet: engine.Set);
        onEnterScene(newSet: engine.Set, previousSet: engine.Set);
        onAboutToExitScene(newSet: string, previousSet: engine.Set);
        onExitScene(newSet: engine.Set, previousSet: engine.Set);
        onEvent(event: Event);
    }
    class Scene {
        public onAboutToEnterScene(newSet: engine.Set, previousSet: engine.Set): void;
        public onEnterScene(newSet: engine.Set, previousSet: engine.Set): void;
        public onAboutToExitScene(newSet: string, previousSet: engine.Set): void;
        public onExitScene(newSet: engine.Set, previousSet: engine.Set): void;
        public onEvent(event: Event): void;
    }
}
declare module org.ags.engine {
    class Set {
        public updatableComponents: engine.OrderedComponents<engine.IUpdatableComponent>;
        public drawableComponents: engine.OrderedComponents<engine.IDrawableComponent>;
        public eventComponents: engine.OrderedComponents<engine.IEventComponent>;
        public gameObjects: engine.GameObject[];
        public stage: engine.Stage;
        public name: string;
        public sceneScript: engine.IScene;
        private feedback;
        constructor(stage: engine.Stage, name: string);
        public createGameObject(name: string): engine.GameObject;
        private performReorder();
        public loop(): void;
        public dispatchEvent(ev: Event): void;
    }
}
declare module org.ags.engine {
    interface GameResolutionSettings {
        width: number;
        height: number;
    }
    interface GameLoopSettings {
        interval: any;
    }
    interface GameSettings {
        resolution: GameResolutionSettings;
        loop: GameLoopSettings;
        startupScene: string;
        sceneNamespace: string;
    }
    interface IUpdateFeedback {
        drawNeeded: boolean;
        orderChanged: boolean;
    }
    interface IUpdatableComponent extends engine.IOrderable {
        update(feedback: IUpdateFeedback);
    }
    interface IDrawableComponent extends engine.IOrderable {
        drawCanvas(context: CanvasRenderingContext2D);
    }
    interface IEventComponent extends engine.IOrderable {
        handleEvent(feedback: IUpdateFeedback, event: Event): boolean;
    }
    class StageParameters {
        public game: string;
        public baseURL: string;
        public selector: string;
    }
    class Stage {
        public game: string;
        public baseURL: string;
        public selector: string;
        public url: string;
        public canvas: HTMLCanvasElement;
        public canvasContext: CanvasRenderingContext2D;
        public gameSettings: GameSettings;
        public currentSet: engine.Set;
        private intervalId;
        constructor(parameters: StageParameters);
        private setup();
        private createCanvas();
        public loadImage(url: string, callbackSuccess: (image: HTMLImageElement, url?: string) => any, callbackFail: (error: engine.ILoadError) => any): HTMLImageElement;
        public loadScript(url: string, callbackSuccess: (script: HTMLScriptElement, url?: string) => any, callbackFail: (error: engine.ILoadError) => any): HTMLScriptElement;
        public loadDataAsync(url: string, callbackSuccess: (data: any, url: string) => any, callbackFail: (error: engine.ILoadError) => any, dataProcessor?: (data: any) => any): XMLHttpRequest;
        public loadData(url: string, dataProcessor?: (data: any) => any): any;
        public loadJson(url: string): any;
        public loadJsonAsync(url: string, callbackSuccess: (data: any, url: string) => any, callbackFail: (error: engine.ILoadError) => any): XMLHttpRequest;
        public loadSettings(): void;
        private setSettings(settings);
        public start(): void;
        public currentScene : string;
        private performanceLastIntervalTime;
        private performanceSample;
        private performanceSampleCount;
        private performanceBeginFrame;
        private startLoop();
        private endLoop();
        public hookEvents(): void;
        public finishedLoadingScene(newSet: engine.Set): void;
        public fatalError(message: string, errorInfo: engine.IError): void;
    }
}
declare module org.ags.engine.components {
    class Character extends components.Sprite implements engine.IDrawableComponent, engine.IUpdatableComponent, engine.IEventComponent {
        private direction;
        public loops: engine.ILoop[];
        public getDirection(): string;
        public setDirection(feedback: engine.IUpdateFeedback, direction: string): void;
        public update(feedback: engine.IUpdateFeedback): void;
        public deserialized(): void;
        public handleEvent(feedback: engine.IUpdateFeedback, event: Event): boolean;
    }
}
declare module org.ags.engine.components {
    class Sprite extends engine.Component implements engine.IDrawableComponent {
        private loop;
        private loopRun;
        private cell;
        private speedTime;
        public speed: number;
        public running: boolean;
        public drawCanvas(context: CanvasRenderingContext2D): void;
        public getLoop(): engine.ILoop;
        public setLoop(feedback: engine.IUpdateFeedback, newLoop: engine.ILoop): void;
        public requiredComponents(): any[];
        public update(feedback: engine.IUpdateFeedback): void;
    }
}
declare module org.ags.engine.components {
    class StaticSprite extends engine.Component implements engine.IDrawableComponent {
        public cell: engine.Cell;
        public drawCanvas(context: CanvasRenderingContext2D): void;
        public requiredComponents(): any[];
    }
}
declare module org.ags.engine.components {
    class Transform extends engine.Component {
        public x: number;
        public y: number;
        public setupGameObject(gameObject: engine.GameObject): boolean;
    }
}
declare function EngineMain(): org.ags.engine.Stage;
