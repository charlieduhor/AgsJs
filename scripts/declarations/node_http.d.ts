
declare module http {
    class Server {
        // Events
        on(name : string,          callback : any);
        on(name : 'close',         callback : () => any);
        on(name : 'connection',    callback : (socket) => any);
        on(name : 'request',       callback : (request : IncomingMessage, response : ServerResponse) => any);
        on(name : 'checkContinue', callback : (request : IncomingMessage, response : ServerResponse) => any);
        on(name : 'connect',       callback : (request : IncomingMessage, socket, head) => any);
        on(name : 'upgrade',       callback : (request : IncomingMessage, socket, head) => any);
        on(name : 'clientError',   callback : (exception, socket) => any);
        
        // Properties
        maxHeaderCount : number;
        timeout        : number;
        
        // Methods
        listen(port   : number, hostname? : string, backlog? : number, callback? : () => any);
        listen(path   : string, callback? : () => any);
        listen(handle : any,    callback? : () => any);
        
        setTimeout(msecs : number, callback : () => any);
    }
    
    class IncomingMessage {
        // Events
        on(name : string,  callback : any);
        on(name : 'close', callback : () => any);
        
        // Properties
        httpVersion : number;
        headers     : { [ name : string ] : string };
        trailers    : { [ name : string ] : string };
        method      : string;
        url         : string;
        statusCode  : number;
        socket      : any;
        
        // Methods
        setTimeout(msecs : number, callback : () => any);
    }
    
    class ServerResponse {
        // Events
        on(name : string,  callback : any);
        on(name : 'close', callback : () => any);
        
        // Properties
        headersSent : boolean;
        sendDate    : boolean;
        statusCode  : number;
        
        // Methods
        setTimeout(msecs : number, callback : () => any);

        write(chunk : any, encoding? : string);
        writeHead(statusCode : number, reason : string, headers : {});
        writeHead(statusCode : number, headers : {});
        writeHead(statusCode : number);
        writeContinue();
        
        end(data? : any, encoding? : string);
        
        addTrailers(headers : {});
        
        getHeader(name : string);
        setHeader(name : string, value : string);
        removeHeader(name : string);
    }
    
    class ClientRequest {
        // Events
        on(name : string,     callback : any);
        on(name : 'reponse',  callback : () => any);
        on(name : 'socket',   callback : () => any);
        on(name : 'connect',  callback : (response : IncomingMessage, socket, head) => any);
        on(name : 'upgrade',  callback : (response : IncomingMessage, socket, head) => any);
        on(name : 'continue', callback : () => any);
        
        // Methods
        abort();
        
        setTimeout(timeout : number, callback : () => any);
        setNoDelay(noDelay? : boolean);
        setSocketKeepAlive(enable? : boolean, initialDelay? : number);
        
        write(chunk : any, encoding? : string);
        end(data : any, encoding? : string);
    }
    
    class Agent {
        maxSockets : number;
        sockets    : any[];
        requests   : ClientRequest[];
    }
    
    class http {
        STATUS_CODE : { [ code: number ]: string };
        globalAgent : Agent;
        
        createServer(requestFunction : (request : IncomingMessage, response : ServerResponse) => any) : Server;
        
        request(options : {},     callback : (response : ServerResponse) => any) : ClientRequest;
        request(options : string, callback : (response : ServerResponse) => any) : ClientRequest;
        
        get(url     : string, callback : (response : ServerResponse) => any) : ClientRequest;
        get(options : {},     callback : (response : ServerResponse) => any) : ClientRequest;
    }
}

declare function require(moduleName : 'http') : http.http;
