import type CLICommand from "./CLICommand";

export default class CLICommandCategory {
	private category: string;
	private commands: CLICommand[];

	constructor(category: string, commands: CLICommand[]) {
		this.category = category;
		this.commands = commands;
	}

	public getCommands(): CLICommand[] {
		return this.commands;
	}

	public getCategory(): string {
		return this.category;
	}
}
