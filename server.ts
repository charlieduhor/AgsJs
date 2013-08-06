
"use strict";

(function() {
    var http_module : http.http = require("http");
    var url         : url.url   = require("url");
    var path        : path.path = require("path");
    var fs          : fs.fs     = require("fs");

    var mimeTypes = {
        ".js":       "application/javascript",
        ".json":     "application/json",
        ".xml":      "text/xml",
        ".html":     "text/html; charset=utf-8",
        ".htm":      "text/html; charset=utf-8",
        ".css":      "text/css",
        ".txt":      "text/plain",
        ".jpg":      "image/jpeg",
        ".jpeg":     "image/jpeg",
        ".png":      "image/png",
        ".gif":      "image/gif",
        ".ico":      "image/vnd.microsoft.icon",
        ".svg":      "image/svg+xml",
        ".mpg":      "video/mpeg",
        ".mpeg":     "video/mpeg",
        ".mp4":      "video/mp4",
        ".mp3":      "audio/mpeg",
        ".wav":      "audio/x-wav",
        ".manifest": "text/cache-manifest",
    };

    function stringToBoolean(s : string, undefinedValue : bool, nullValue : bool) : bool {
        switch(s.toLowerCase()){
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
    
    function processIfExists(response : http.ServerResponse, filename : string, callback : (response : http.ServerResponse, filename : string) => any) {
        fs.exists(filename, function(exists : bool) {
            if (!exists) {
                response.writeHead(404, {
                    "Content-Type": "text/plain",
                });

                response.write("404 Not Found (" + filename + ")\n");
                response.end();
                return;
            }

            callback(response, filename);
        });
    }
    
    function generateEntryDescription(output : {}, fullPath : string, entry : string, recursive : bool, callback : () => any) {
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
                        
                        generateFolderDescription(fullPath, true, function(response : {}) {
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
    
    function generateFolderDescription(dir : string, recursive : bool, callback : (response : {}) => any) {
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
                generateEntryDescription(output, fullPath, entry, recursive, checkEnd);
            }
            
            checkEnd();
        });
    }
    
    http_module.createServer(function(request : http.IncomingMessage, response : http.ServerResponse) {
        var uriInfo : url.info = url.parse(request.url, true);
        var uri     : string   = uriInfo.pathname;
        
        if (uri === "/") {
            response.writeHead(301, {
                "Location": path.join(request.url, "player.html"),
            });

            response.end();
            return;
        }
        
        var filename : string = path.join(process.cwd(), uri);

        processIfExists(response, filename, function() {
            fs.stat(filename, function (error, statInfo : fs.Stats) {
                if (statInfo.isDirectory()) {
                    generateFolderDescription(filename, stringToBoolean(uriInfo.query["recursive"], false, true), function(content : {}) {
                        var buffer : Buffer = new Buffer(JSON.stringify(content));
                        
                        response.writeHead(200, {
                            "Content-Type":   mimeTypes[".json"],
                            "Content-Length": buffer.length
                        });
    
                        response.write(buffer);
                        response.end();
                    })
                    return;
                }

                var fileDate   : Date = statInfo.mtime;
                var headerDate : Date;

                if (request.headers["if-modified-since"]) {
                    headerDate = new Date(request.headers["if-modified-since"]);

                    if (fileDate <= headerDate) {
                        response.writeHead(304, {});
                        response.end();
                        return;
                    }
                }

                if (request.headers["if-unmodified-since"]) {
                    headerDate = new Date(request.headers["if-unmodified-since"]);

                    if (fileDate >= headerDate) {
                        response.writeHead(304, {});
                        response.end();
                        return;
                    }
                }

                fs.readFile(filename, "binary", function (error, file) {
                    if (error) {
                        response.writeHead(500, {
                            "Content-Type": "text/plain",
                        });

                        response.write("500 Error\n" + error + "\n");
                        response.end();
                        return;
                    }

                    response.writeHead(200, {
                        "Content-Type":   mimeTypes[path.extname(filename)],
                        "Content-Length": statInfo.size,
                        "Last-Modified":  statInfo.mtime,
                    });

                    response.write(file, "binary");
                    response.end();
                });
            });
        });
    }).listen(process.env.PORT, process.env.IP);
})();
