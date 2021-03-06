
declare module fs {
    class Stats {
        isFile() : boolean;
        isDirectory() : boolean;
        isBlockDevice() : boolean;
        isCharacterDevice() : boolean;
        isSymbolicLink() : boolean;
        isFIFO() : boolean;
        isSocket() : boolean;
        
        size  : number;
        atime : Date;
        mtime : Date;
        ctime : Date;
    }
    
    class fs {
        exists(path : string, callback : (exists : boolean) => any);
        
        stat (path : string, callback : (err : any, stats : Stats) => any);
        lstat(path : string, callback : (err : any, stats : Stats) => any);
        
        readFile(filename : string, callback : (err, data) => any);
        readFile(filename : string, encoding : string, callback : (err, data) => any);
        readFile(filename : string, options  : {},     callback : (err, data) => any);
        
        readdir(path : string, callback : (err, files : string[]) => any);
        
        readlink(path : string, callback : (err, linkString : string) => any);
        readlinkSync(path : string) : string;
    }
}

declare function require(moduleName : 'fs') : fs.fs;
