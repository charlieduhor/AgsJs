
"use strict";

module org.ags.server {
    export var http_module : http.http = require("http");
    export var url         : url.url   = require("url");
    export var path        : path.path = require("path");
    export var fs          : fs.fs     = require("fs");
    
    export var mimeTypes : { [s: string] : string } = {
        ".js":       "application/javascript",
        ".json":     "application/json",
        ".xml":      "text/xml",
        ".html":     "text/html; charset=utf-8",
        ".htm":      "text/html; charset=utf-8",
        ".css":      "text/css",
        ".txt":      "text/plain",
        ".ts":       "text/typescript",
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
    
    export class Server {
        public httpServer : http.Server;
        
        constructor() {
            var that = this;
            
            this.httpServer = http_module.createServer(function(request : http.IncomingMessage, response : http.ServerResponse) {
                that.handle(request, response);
            });
        }
        
        public processIfExists(response : http.ServerResponse, filename : string, callback : (response : http.ServerResponse, filename : string) => any) : void {
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
        
        public listen(port : number, hostname? : string, backlog? : number) : void {
            this.httpServer.listen(port, hostname, backlog);
        }
        
        public handle(request : http.IncomingMessage, response : http.ServerResponse) : void {
            var uriInfo : url.info = url.parse(request.url, true);
            var uri     : string   = uriInfo.pathname;
            
            if (uri === "/") {
                this.handleRoot(request, response);
                return;
            }
            
            var filename : string = path.join(process.cwd(), uri);
            var that              = this;
    
            this.processIfExists(response, filename, function() {
                fs.stat(filename, function (error, statInfo : fs.Stats) {
                    if (statInfo.isDirectory()) {
                        that.handleDirectory(request, response, filename, statInfo);
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
        }
        
        public handleRoot(request : http.IncomingMessage, response : http.ServerResponse) : void {
            var buffer : Buffer = new Buffer("Can't list directory content");
            
            response.writeHead(403, {
                "Content-Type":   "text/plain",
                "Content-Length": buffer.length
            });
            
            response.end();
        }
        
        public handleDirectory(request : http.IncomingMessage, response : http.ServerResponse, path : string, statInfo : fs.Stats) : void {
            var buffer : Buffer = new Buffer("Can't list directory content");
            
            response.writeHead(403, {
                "Content-Type":   "text/plain",
                "Content-Length": buffer.length
            });
            
            response.end();
        }
    }
}
