
"use strict";

String.prototype.startsWith = function (str) {
    return this.indexOf(str) === 0;
};

String.prototype.endsWith = function (str) {
    return this.slice(-str.length) === str;
};

(function() {
    var path  = require("path");
    var fs    = require("fs");
    
    function getFullPath(baseUri, thisPath, file) {
        if (file.length === 0) {
            return undefined;
        }
        
        if (file[0] === '/') {
            return path.join(baseUri, file);
        }
        else {
            return path.join(thisPath, file);
        }
    }
    
    function updateFileSizeInJson(level, baseUri, path, data) {
        var t           = typeof data;
        var returnValue = 0;
        
        if (t === "object") {
            if (data["className"] === "HTMLImageElement") {
                var statInfo = fs.statSync(getFullPath(baseUri, path, data["url"]));
                
                if (data["urlContentLength"] === undefined) {
                    data["urlContentLength"] = statInfo.size;
                    returnValue = 1;
                }
                else if (data["urlContentLength"] !== statInfo.size) {
                    data["urlContentLength"] = statInfo.size;
                    returnValue = 1;
                }
            }
        }
        
        if (t === "object" || t === "array") {
            for (var key in data) {
                var i = updateFileSizeInJson(level + 1, baseUri, path, data[key]);
                
                returnValue |= i;
            }
        }
        
        return returnValue;
    }
    
    function processFile(baseUri, thisPath, fileFull) {
        fs.readFile(fileFull, "binary", function (error, binaryData) {
            var fileFullName = fileFull;
            var jsonData;
            
            try {
                jsonData = JSON.parse(binaryData);
            }
            catch (e) {
                console.log("Failed to parse " + fileFullName + ". " + e);
            }
            
            var jsonUpdated = updateFileSizeInJson(baseUri, jsonData);
        
            var r = updateFileSizeInJson(0, baseUri, thisPath, jsonData);
        
            if (r === 1) {
                console.log("Updated " + fileFull);
                
                fs.writeFile(fileFull, JSON.stringify(jsonData, null, "  "), function (err) {
                    if (err) {
                        console.log(err);
                    }
                });
            }
        });
    }
    
    function findJson(baseUri, thisPath) {
        var files = fs.readdirSync(thisPath);
        
        for (var fileIndex in files) {
            var file     = files[fileIndex];
            var fileFull = path.join(thisPath, file);
            
            if (file.endsWith(".json")) {
                processFile(baseUri, thisPath, fileFull);
                continue;
            }
            
            var statInfo = fs.statSync(fileFull);
            
            if (statInfo.isDirectory()) {
                findJson(baseUri, fileFull);
            }
        }
    } 

    var games = fs.readdirSync("Games");
    
    for (var gameIndex in games) {
        var game = games[gameIndex];
        
        var baseUri = path.join("Games", game);
        
        findJson(baseUri, baseUri);
    }
})();
