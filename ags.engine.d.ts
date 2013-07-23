interface String {
    vformat(args: any[]): string;
    format(...args: any[]): string;
    startsWith(s: string): bool;
    endsWith(s: string): bool;
}
module org.ags.engine {
    class Path {
        static dirname(url: string): string;
        static simplify(u1: string): string;
        static join(u1: string, u2: string): string;
    }
    class Utilities {
        static getBasePath(): string;
        static parseQueryString(queryString?: string, urlParams?: {}): {};
        static guid(): string;
    }
}
module org.ags.engine {
    class Log {
        static info(s: string, ...args: any[]): void;
        static error(s: string, ...args: any[]): void;
        static warning(s: string, ...args: any[]): void;
    }
}
module org.ags.engine {
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
        static __HIDE_IN_EDITOR__: bool;
    }
}
module org.ags.engine {
    class EventHandler {
        public next: any;
        static add(eh: EventHandler, peh: EventHandler): EventHandler;
        static remove(eh: EventHandler, peh: EventHandler): EventHandler;
    }
}
module org.ags.engine {
    interface IOrderableComponent {
        order: number;
    }
    class OrderedComponents {
        public components: IOrderableComponent[];
        constructor();
        public add(component: IOrderableComponent): number;
        private _add(component, b1, b2);
        public debugOrders(): string;
        public reorder(): void;
    }
}
module org.ags.engine {
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
module org.ags.engine {
    interface ILoaderDelegate {
        loadJsonAsync(url: string, callbackSuccess: (data: any, url: string) => any, callbackFail: (error: ILoadError) => any): XMLHttpRequest;
        progress(percent: number);
        finished();
        error(error: IError): any;
        createObject(loader: Loader, className: string, objectInfo: {}): any;
        createImage(url: string, callbackSuccess: (image: HTMLImageElement, url?: string) => any, callbackFail: (error: ILoadError) => any): HTMLImageElement;
        postProcess(loader: Loader, basePath: string, classObject: any, objectInfo: {}): bool;
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
        static isReservedProperty(name: string): bool;
        static isReservedObjectID(id: string): bool;
        private createObjects(basePath, data);
        private createObjectProperties();
        public load(url: string): void;
    }
}
module org.ags.engine {
    interface IRunLoop {
        current(): ICell;
        next(): ICell;
    }
    interface ILoop {
        run(): IRunLoop;
    }
    class CellLoop implements ILoop {
        public cells: ICell[];
        public cycle: bool;
        public run(): IRunLoop;
    }
}
module org.ags.engine {
    class Component implements IOrderableComponent {
        public gameObject: GameObject;
        public order: number;
        constructor();
        public setupGameObject(gameObject: GameObject): bool;
        public requiredComponents(): any[];
        public init(): void;
    }
}
module org.ags.engine {
    class GameObject {
        public owner: Set;
        public name: string;
        public components: Component[];
        public transform: components.Transform;
        constructor(owner: Set, name: string);
        public stage : Stage;
        public hasComponent(componentClass: any): bool;
        public addComponentByClass(componentClass: any): Component;
        public ensureHasComponents(requiredComponents: any[]): void;
        public addComponent(component: Component): void;
    }
}
module org.ags.engine {
    class Set {
        public updatableComponents: OrderedComponents;
        public drawableComponents: OrderedComponents;
        public eventComponents: OrderedComponents;
        public gameObjects: GameObject[];
        public stage: Stage;
        public name: string;
        private feedback;
        constructor(stage: Stage, name: string);
        public createGameObject(name: string): GameObject;
        public loop(): void;
    }
}
module org.ags.engine {
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
    }
    interface IUpdateFeedback {
        drawNeeded: bool;
        orderChanged: bool;
    }
    interface IEvent {
    }
    interface IUpdatableComponent extends IOrderableComponent {
        update(feedback: IUpdateFeedback);
    }
    interface IDrawableComponent extends IOrderableComponent {
        drawCanvas(context: CanvasRenderingContext2D);
    }
    interface IEventHandlingComponent extends IOrderableComponent {
        handleEvent(feedback: IUpdateFeedback, event: IEvent);
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
        public currentSet: Set;
        private intervalId;
        constructor(parameters: StageParameters);
        private setup();
        private createCanvas();
        public loadImage(url: string, callbackSuccess: (image: HTMLImageElement, url?: string) => any, callbackFail: (error: ILoadError) => any): HTMLImageElement;
        public loadDataAsync(url: string, callbackSuccess: (data: any, url: string) => any, callbackFail: (error: ILoadError) => any, dataProcessor?: (data: any) => any): XMLHttpRequest;
        public loadData(url: string, dataProcessor?: (data: any) => any): any;
        public loadJson(url: string): any;
        public loadJsonAsync(url: string, callbackSuccess: (data: any, url: string) => any, callbackFail: (error: ILoadError) => any): XMLHttpRequest;
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
        public finishedLoadingScene(newSet: Set): void;
        public fatalError(message: string, errorInfo: IError): void;
    }
}
module org.ags.engine.components {
    class Character extends Sprite implements IDrawableComponent, IUpdatableComponent {
        private direction;
        public loops: ILoop[];
        public getDirection(): string;
        public setDirection(feedback: IUpdateFeedback, direction: string): void;
        public update(feedback: IUpdateFeedback): void;
        public deserialized(): void;
    }
}
module org.ags.engine.components {
    class Sprite extends Component implements IDrawableComponent {
        private loop;
        private loopRun;
        private cell;
        private speedTime;
        public speed: number;
        public autostart: bool;
        public drawCanvas(context: CanvasRenderingContext2D): void;
        public getLoop(): ILoop;
        public setLoop(feedback: IUpdateFeedback, newLoop: ILoop): void;
        public requiredComponents(): any[];
        public start(): void;
        public update(feedback: IUpdateFeedback): void;
    }
}
module org.ags.engine.components {
    class StaticSprite extends Component implements IDrawableComponent {
        public cell: Cell;
        public drawCanvas(context: CanvasRenderingContext2D): void;
        public requiredComponents(): any[];
    }
}
module org.ags.engine.components {
    class Transform extends Component {
        public x: number;
        public y: number;
        public setupGameObject(gameObject: GameObject): bool;
    }
}
function EngineMain(): org.ags.engine.Stage;
