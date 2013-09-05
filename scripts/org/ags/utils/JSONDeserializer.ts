
"use strict";

module org.ags.utils {
    export interface IJSONDeserializerDelegate extends ILoader {
        // Progress
        progress(percent : number);
        
        // Called when objects are finished loaded. (even when error was trigerred.)
        finished();
        
        // Called when an error is intercepted. (it won't stop loading)
        error(error: IError) : any;
        
        // Give a change to the caller of the loader object to hook the object
        // creation procedures.
        createObject(loader : JSONDeserializer, className : string, objectInfo : {}) : any;
        
        // Give a chance to the caller of the loader object to hook the object
        // post-processing procedures.
        postProcess(loader : JSONDeserializer, basePath : string, classObject : any, objectInfo : {}) : boolean;
    }
    
    export class JSONDeserializer {
        // Number of loading resources pending.
        private loadingResources : number = 0;
        
        // Number of bytes loaded.
        private loadingBytes : number = 0;
        
        // Total number of bytes to load.
        private totalBytes : number = 1;
        
        // Delegate of this loader
        private delegate : IJSONDeserializerDelegate;
        
        // Object map. (UUID => instance pointer)
        private map : {} = {};
        
        // Object post processor.
        private postProcess : any[] = [];

        constructor(delegate : IJSONDeserializerDelegate) {
            this.delegate = delegate;
        }

        private resourceLoadProcessed(bytes : number) {
            this.loadingResources--;
            this.loadingBytes += bytes;
            
            if (this.loadingResources === 0) {
                this.createObjectProperties();
                this.delegate.finished();
            }
        }
            
        private resourceLoadSuccess(bytes : number) {
            this.resourceLoadProcessed(bytes);
        }
        
        private resourceLoadFailed(bytes : number, error : IError) {
            this.delegate.error(error);
            this.resourceLoadProcessed(bytes);
        }
        
        private loadImage(basePath : string, objectInfo : {}) : HTMLImageElement {
            var that                   = this;
            var contentLength : number = objectInfo["urlContentLength"];
            
            if (contentLength === undefined) {
                contentLength = 0;
            }
            
            this.loadingResources++;
            this.totalBytes += contentLength;
            
            try {
                return this.delegate.loadImage(
                    Path.join(basePath, objectInfo["url"]),
                    function () {
                        that.resourceLoadSuccess(contentLength);
                    },
                    function (error : IError) {
                        that.resourceLoadFailed(contentLength, error);
                    });
            }
            catch (e) {
                this.resourceLoadFailed(contentLength, e);
                return undefined;
            }
        }
        
        private loadObject(basePath : string, objectInfo : {}, id : string, postProcess : boolean) : any {
            var className            : string = objectInfo["className"];
            var objectImplementation : any;
            
            objectImplementation = this.delegate.createObject(this, className, objectInfo);
            
            if (objectImplementation === undefined) {
                if (className === "HTMLImageElement") {
                    objectImplementation = this.loadImage(basePath, objectInfo);
                    postProcess          = false;
                }
                else {
                    var classType : any = eval(className);
                    
                    try {
                        objectImplementation = new classType();
                    }
                    catch (e) {
                        Log.error("Failed to create object of type {0}. {1}".format(className, e));
                    }
                }
            }
            
            if (objectImplementation !== undefined) {
                if (id !== undefined) {
                    this.map[id] = objectImplementation;
                }
                
                if (postProcess) {
                    this.postProcess.push([basePath, objectImplementation, objectInfo]);
                }
            }
            else {
                Log.error("Failed to create object of type {0}. Constructor returned 'undefined'".format(className));
            }
            
            return objectImplementation;
        }
        
        private loadObjectProperties(basePath : string, o : {}, values : {}) {
            for (var key in values) {
                if (JSONDeserializer.isReservedProperty(key)) {
                    continue;
                }
                
                o[key] = this.loadProperty(basePath, values[key]);
            }
        }
        
        public loadProperty(basePath : string, propValue : any) : any {
            if (typeof propValue === "string") {
                if (propValue.match("^\\#[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$")) {
                    return this.map[propValue.substring(1)];
                }
            }
            else if (propValue instanceof Array) {
                var newArray    : any[]  = [];
                var arrayLength : number = propValue.length;
                var arrayIndex  : number;
                
                newArray.length = arrayLength;
                for (arrayIndex = 0; arrayIndex < arrayLength; arrayIndex++) {
                    newArray[arrayIndex] = this.loadProperty(basePath, propValue[arrayIndex]);
                }
                
                return newArray;
            }
            else if (propValue instanceof Object) {
                var newObject;
                
                if (propValue["className"] !== undefined) {
                    newObject = this.loadObject(basePath, propValue, undefined, false);
                }
                else {
                    newObject = {};
                }
                
                this.loadObjectProperties(basePath, newObject, propValue);
                return newObject;
            }
            
            return propValue;
        }

        public static isReservedProperty(name : string) : boolean {
            return name === "className";
        }
        
        public static isReservedObjectID(id : string) : boolean {
            return id === "externals";
        }
        
        private createObjects(basePath : string, data : any) {
            var objectID  : string;
            var externals : any[] = data["externals"];
            
            if (externals !== undefined) {
                var externalIndex : number;
                var externalCount : number = externals.length;
                
                for (externalIndex = 0; externalIndex < externalCount; externalIndex++) {
                    this.load(Path.join(basePath, externals[externalIndex]));
                }
            }
            
            for (objectID in data) {
                if (!JSONDeserializer.isReservedObjectID(objectID)) {
                    this.loadObject(basePath, data[objectID], objectID, true);
                }
            }
        }
        
        private createObjectProperties() {
            var post;
            var postIndex : number;
            var postCount : number = this.postProcess.length;
            
            for (postIndex = 0; postIndex < postCount; postIndex++) {
                post = this.postProcess[postIndex];
                
                if (!this.delegate.postProcess(this, post[0], post[1], post[2])) {
                    this.loadObjectProperties(post[0], post[1], post[2]);
                }
            }

            for (postIndex = 0; postIndex < postCount; postIndex++) {
                post = this.postProcess[postIndex][1];
                
                var deserialized = post["deserialized"];
                
                if (deserialized !== undefined) {
                    if (deserialized instanceof Function) {
                        deserialized.call(post)
                    }
                }
            }
            
            this.postProcess = [];
        }

        public load(url : string) {
            var that     = this;
            var basePath = Path.dirname(url);
            
            this.loadingResources++;
            
            try {
                this.delegate.loadJsonAsync(url,
                    function (data : any) {
                        that.createObjects(basePath, data);
                        that.resourceLoadSuccess(0);
                    },
                    function (error : ILoadError) {
                        that.resourceLoadFailed(0, error);
                    });
            }
            catch (e) {
                this.resourceLoadFailed(0, e);
            }
        }
        
        public loadScript(url : string) : HTMLScriptElement {
            var that     = this;
            var basePath = Path.dirname(url);
            
            this.loadingResources++;
            
            try {
                return this.delegate.loadScript(url,
                    function (data : HTMLScriptElement) {
                        that.resourceLoadSuccess(0);
                    },
                    function (error : ILoadError) {
                        that.resourceLoadFailed(0, error);
                    });
            }
            catch (e) {
                this.resourceLoadFailed(0, e);
            }
            
            return undefined;
        }
    };
}
