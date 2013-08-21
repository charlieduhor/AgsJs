
declare module node.process {
    class Process {
        env : any;
        
        cwd() : string;
    }
}

declare var process : node.process.Process;
