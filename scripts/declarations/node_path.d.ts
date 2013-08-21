
declare module path {
    class path {
        join   (...args : string[]) : string;
        resolve(...args : string[]) : string;
        
        relative(from : string, to   : string);
        basename(path : string, ext? : string);

        normalize(path : string) : string;
        dirname  (path : string) : string;
        extname  (path : string) : string;
        
        sep       : string;
        delimiter : string;
    }
}

declare function require(moduleName : 'path') : path.path;
