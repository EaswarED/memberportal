export class Logger {
	public static debug(val: any): void {
		console.log(val); // eslint-disable-line
	}

	public static log(val: any, banner?: any): void {
		if (banner) {
			console.log(banner + ' => ' + JSON.stringify(val)); // eslint-disable-line
		} else {
			console.log(val); // eslint-disable-line
		}
	}

	public static err(val: any): void {
		console.log('Error => ' + val); // eslint-disable-line
	}

	public static fatal(val: any): void {
		// eslint-disable-next-line no-console
		console.log('Fatal Error => ' + val); // eslint:disable-line
		// eslint-disable-next-line no-console
		console.log(val); // eslint:disable-line
	}
}
