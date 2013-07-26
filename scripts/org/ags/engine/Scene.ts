"use strict";

module org.ags.engine {
    export interface IScene {
        onAboutToEnterScene(newSet : Set, previousSet : Set);
        onEnterScene(newSet : Set, previousSet : Set);
        
        onAboutToExitScene(newSet : string, previousSet : Set);
        onExitScene(newSet : Set, previousSet : Set);
        
        onEvent(event : Event);
    };

    export class Scene {
        public onAboutToEnterScene(newSet : Set, previousSet : Set) {
        }
        
        public onEnterScene(newSet : Set, previousSet : Set) {
        }
        
        public onAboutToExitScene(newSet : string, previousSet : Set) {
        }
        
        public onExitScene(newSet : Set, previousSet : Set) {
        }
        
        public onEvent(event : Event) {
        }
    };
}