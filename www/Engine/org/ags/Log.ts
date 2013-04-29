
module org.ags {
	export class Log {
		public static info(s : string, ...args : string[]) {
			console.log(vformat(s, args));
		}
		
		public static error(s : string, ...args : string[]) {
			console.error(vformat(s, args));
		}
		
		public static warning(s : string, ...args : string[]) {
			console.warn(vformat(s, args));
		}
	}
}
