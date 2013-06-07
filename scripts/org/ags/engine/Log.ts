
module org.ags.engine {
	export class Log {
		public static info(s : string, ...args : any[]) {
			console.log(s.vformat(args));
		}
		
		public static error(s : string, ...args : any[]) {
			console.error(s.vformat(args));
		}
		
		public static warning(s : string, ...args : any[]) {
			console.warn(s.vformat(args));
		}
	}
}
