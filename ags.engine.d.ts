declare module org.ags.engine {
    enum KeyEvent {
        DOM_VK_LEFT = 0x25,
        DOM_VK_UP = 0x26,
        DOM_VK_RIGHT = 0x27,
        DOM_VK_DOWN = 0x28,
    }
    class EventHandler {
        public next: any;
        static add(eh: EventHandler, peh: EventHandler): EventHandler;
        static remove(eh: EventHandler, peh: EventHandler): EventHandler;
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
    interface IRunLoop {
        current(): engine.ICell;
        next(): engine.ICell;
        move(index: number): engine.ICell;
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
    class Component implements ags.utils.IOrderable {
        public gameObject: engine.GameObject;
        private _order;
        constructor();
        public order : number;
        public setupGameObject(gameObject: engine.GameObject): boolean;
        public requiredComponents(): any[];
        public init(): void;
        public signalDrawNeeded(): void;
    }
}
declare module org.ags.engine {
    class GameObject {
        public owner: engine.Set;
        public _parent: GameObject;
        public name: string;
        public components: engine.Component[];
        public transform: engine.components.Transform;
        constructor(owner: engine.Set, parent: GameObject, name: string);
        public parent : GameObject;
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
        public updatableComponents: ags.utils.OrderedComponents<engine.IUpdatableComponent>;
        public drawableComponents: ags.utils.OrderedComponents<engine.IDrawableComponent>;
        public eventComponents: ags.utils.OrderedComponents<engine.IEventComponent>;
        public gameObjects: engine.GameObject[];
        public stage: engine.Stage;
        public name: string;
        public sceneScript: engine.IScene;
        private drawNeeded;
        private orderChanged;
        constructor(stage: engine.Stage, name: string);
        public createGameObject(name: string, parent?: engine.GameObject): engine.GameObject;
        private performReorder();
        public loop(): void;
        public dispatchEvent(ev: Event): void;
        public onParentChanged(go: engine.GameObject, newParent: engine.GameObject): void;
        public onComponentAdded(go: engine.GameObject, component: engine.Component): void;
        public onOrderChanged(go: engine.GameObject, component: engine.Component, order: number): void;
        public onDrawNeeded(go: engine.GameObject, component: engine.Component): void;
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
    interface IUpdatableComponent extends ags.utils.IOrderable {
        update(): void;
    }
    interface IDrawableComponent extends ags.utils.IOrderable {
        drawCanvas(context: CanvasRenderingContext2D): void;
    }
    interface IEventComponent extends ags.utils.IOrderable {
        handleEvent(event: Event): boolean;
    }
    class StageParameters {
        public game: string;
        public baseURL: string;
        public selector: string;
    }
    class StageLoaderDelegate extends ags.utils.Loader {
        private stage;
        private newSet;
        private sceneName;
        constructor(stage: Stage, newSet: engine.Set, sceneName: string);
        public progress(percent: number): void;
        public finished(): void;
        public error(error: ags.utils.IError): any;
        public createObject(loader: ags.utils.JSONDeserializer, className: string, objectInfo: any): any;
        public postProcess(loader: ags.utils.JSONDeserializer, basePath: string, classObject: any, objectInfo: {}): boolean;
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
        public loader : ags.utils.Loader;
        private setup();
        private createCanvas();
        public loadSettings(): void;
        private setSettings(settings);
        public start(): void;
        public createJSONDeserializerDelegate(newSet: engine.Set, sceneName: string): ags.utils.IJSONDeserializerDelegate;
        public createJSONDeserializer(newSet: engine.Set, sceneName: string): ags.utils.JSONDeserializer;
        public createSet(sceneName: string): engine.Set;
        public currentScene : string;
        private performanceLastIntervalTime;
        private performanceSample;
        private performanceSampleCount;
        private performanceBeginFrame;
        private startLoop();
        private endLoop();
        public hookEvents(): void;
        public finishedLoadingScene(newSet: engine.Set): void;
        public fatalError(message: string, errorInfo: ags.utils.IError): void;
    }
}
declare module org.ags.engine.components {
    class Character extends components.Sprite implements engine.IDrawableComponent, engine.IUpdatableComponent, engine.IEventComponent {
        private _direction;
        public loops: engine.ILoop[];
        public direction : string;
        public update(): void;
        public deserialized(): void;
        public handleEvent(event: Event): boolean;
    }
}
declare module org.ags.engine.components {
    class Sprite extends engine.Component implements engine.IDrawableComponent {
        private _loop;
        private loopRun;
        private cell;
        private step;
        public speed: number;
        public running: boolean;
        public drawCanvas(context: CanvasRenderingContext2D): void;
        public loop : engine.ILoop;
        public requiredComponents(): any[];
        public update(): void;
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
        private _x;
        private _y;
        public x : number;
        public y : number;
        public setPosition(nx: number, ny: number): void;
        public move(nx: number, ny: number): void;
        public setupGameObject(gameObject: engine.GameObject): boolean;
    }
}
declare function EngineMain(): org.ags.engine.Stage;
