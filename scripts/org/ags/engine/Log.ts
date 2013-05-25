
module org.ags.engine {
	export class Log {
		public static info(s : string, ...args : string[]) {
			console.log(s.vformat(args));
		}
		
		public static error(s : string, ...args : string[]) {
			console.error(s.vformat(args));
		}
		
		public static warning(s : string, ...args : string[]) {
			console.warn(s.vformat(args));
		}
	}
}
