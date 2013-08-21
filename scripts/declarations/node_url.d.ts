
declare module url {
    class info {
        href     : string;
        protocol : string;
        host     : string;
        auth     : string;
        hostname : string;
        port     : number;
        pathname : string;
        search   : string;
        path     : string;
        query    : { [ name : string ] : string };
        hash     : string;
    }
    
    class url {
        parse  (urlStr : string, parseQueryString? : bool, slashesDenoteHost? : bool) : info;
        format (urlObj : {}) : string;
        resolve(p1 : string, p2 : string);
    }
}

declare function require(moduleName : 'url') : url.url;
