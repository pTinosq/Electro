export default class CLICommand {
	name: string;
	description: string;
	commandString: string;
	callback: (canExecute: boolean, ...args: string[]) => void;
	when: () => boolean;

	constructor(
		name: string,
		description: string,
		commandString: string,
		callback: (isAllowed: boolean, ...args: string[]) => void,
		when: () => boolean,
	) {
		this.name = name;
		this.description = description;
		this.commandString = commandString;
		this.callback = callback;
		this.when = when;
	}

	execute(...args: string[]) {
		const isAllowed = this.when();
		this.callback(isAllowed, ...args);
	}
}
