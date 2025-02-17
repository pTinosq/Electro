import type CLICommand from "./CLICommand";
import CommandRegistry from "./CommandRegistry";

export default class CLIProcessor {
	findCommand(commandText: string): CLICommand | null {
		return null;
	}

	processCommand(command: CLICommand) {
		command.execute();
	}
}
