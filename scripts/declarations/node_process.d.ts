
declare module node.process {
    class Process {
        env : any;
        
        cwd() : string;
        chdir(newCwd : string): void;
    }
}

declare var process : node.process.Process;
