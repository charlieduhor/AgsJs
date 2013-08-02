
"use strict";

module org.ags.engine {
    export enum KeyEvent {
        DOM_VK_LEFT  = 0x25,
        DOM_VK_UP    = 0x26,
        DOM_VK_RIGHT = 0x27,
        DOM_VK_DOWN  = 0x28
    }
    
    export class EventHandler {
        public next : any;
        
        public static add(eh: EventHandler, peh : EventHandler) : EventHandler {
            var feh : EventHandler = peh;
            
            while (peh !== undefined) {
                if (peh.next === undefined) {
                    peh.next = eh;
                    return feh;
                }
                
                peh = peh.next;
            }
            
            return eh;
        }
        
        public static remove(eh : EventHandler, peh : EventHandler) : EventHandler {
            if (eh === peh) {
                peh     = eh.next;
                eh.next = undefined;
                return peh;
            }
            
            var feh : EventHandler = peh;
            
            while (peh !== undefined) {
                if (peh.next === eh) {
                    peh.next = eh.next;
                    eh.next  = undefined;
                    break;
                }
                
                peh = peh.next;
            }
            
            return feh;
        }
    };
    
}
