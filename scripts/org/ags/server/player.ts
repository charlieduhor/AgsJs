
"use strict";

module org.ags.server {
    class ServerPlayer extends Server {
        public handleRoot(request : http.IncomingMessage, response : http.ServerResponse) : void {
            response.writeHead(301, {
                "Location": path.join(request.url, "player.html"),
            });

            response.end();
        }
    };
    
    (new ServerPlayer()).listen(process.env.PORT, process.env.IP);
};
