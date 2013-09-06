
"use strict";

module org.ags.server {
    function stringToBoolean(s : string, undefinedValue : boolean, nullValue : boolean) : boolean {
        if (typeof s === "string") {
            s = s.toLowerCase();
        }
        
        switch (s) {
            case "true":
            case "yes":
            case "1":
                return true;
                
    		case "false":
            case "no":
            case "0":
                return false;
                
            case "":
            case null:
                return nullValue;
                
            case undefined:
    		default:
                return undefinedValue;
    	}
    }
    
    class ServerEditor extends Server {
        public handleRoot(request : http.IncomingMessage, response : http.ServerResponse) : void {
            response.writeHead(301, {
                "Location": path.join(request.url, "editor.html"),
            });

            response.end();
        }
        
        public generateEntryDescription(output : {}, fullPath : string, entry : string, recursive : boolean, callback : () => any) {
            var that              = this;
            var pending  : number = 1;
            var checkEnd : () => any = function() {
                pending--;
            
                if (pending === 0) {
                    callback();
                }
            }
            
            fs.lstat(fullPath, function(err, stats : fs.Stats) {
                if (!err) {
                    var info = {};
                    
                    info["mime"]  = mimeTypes[path.extname(entry)];
                    info["mtime"] = stats.mtime;
                    info["ctime"] = stats.ctime;
                    info["atime"] = stats.atime;
                    
                    if (stats.isSymbolicLink()) {
                        info["type"] = "symlink";
                        pending++;
                        
                        fs.readlink(fullPath, function(err, target : string) {
                            info["target"] = target;
                            checkEnd();
                        });
                    }
                    else if (stats.isFile()) {
                        info["type"] = "file";
                        info["size"] = stats.size;
                    }
                    else if (stats.isDirectory()) {
                        info["type"] = "directory";
                        info["mime"] = "text/directory";
                        
                        if (recursive) {
                            pending++;
                            
                            that.generateFolderDescription(fullPath, true, function(response : {}) {
                                info["content"] = response;
                                checkEnd();
                            });
                        }
                    }
                    else {
                        info["type"] = "special";
                    }
                    
                    output[entry] = info;
                }
                else {
                    console.log(err);
                }
                
                checkEnd();
            });
        }
        
        public generateFolderDescription(dir : string, recursive : boolean, callback : (response : {}) => any) {
            var that   = this;
            var output = {};
            var pending  : number    = 1;
            var checkEnd : () => any = function () {
                pending--;
                
                if (pending === 0) {
                    callback(output);
                }
            };
            
            fs.readdir(dir, function(err, entries : string[]) {
                var i     : number;
                var count : number = entries.length;
                
                for (i = 0; i < count; i++) {
                    var entry    : string = entries[i];
                    var fullPath : string = path.join(dir, entry);
                    
                    pending++;
                    that.generateEntryDescription(output, fullPath, entry, recursive, checkEnd);
                }
                
                checkEnd();
            });
        }
        
        public handleDirectory(request : http.IncomingMessage, response : http.ServerResponse, path : string, statInfo : fs.Stats) : void {
            var uriInfo : url.info = url.parse(request.url, true);
            
            this.generateFolderDescription(path, stringToBoolean(uriInfo.query["recursive"], false, true), function(content : {}) {
                var buffer : Buffer = new Buffer(JSON.stringify(content));
                
                response.writeHead(200, {
                    "Content-Type":   mimeTypes[".json"],
                    "Content-Length": buffer.length
                });

                response.write(buffer);
                response.end();
            });
        }
    };
    
    (new ServerEditor()).listen(process.env.PORT, process.env.IP);
};
