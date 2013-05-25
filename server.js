
"use strict";

(function() {
    var http  = require("http");
    var url   = require("url");
    var path  = require("path");
    var fs    = require("fs");

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

    function processIfExists(response, filename, callback) {
        fs.exists(filename, function(exists) {
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

    http.createServer(function(request, response) {
        var uri      = url.parse(request.url).pathname;
        var filename = path.join(process.cwd(), uri);

        processIfExists(response, filename, function() {
            fs.stat(filename, function (error, statInfo) {
                if (statInfo.isDirectory()) {
                    response.writeHead(301, {
                        "Location": path.join(request.url, "index.html"),
                    });

                    response.end();
                    return;
                }

                var fileDate = new Date(statInfo.mtime);
                var headerDate;

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

