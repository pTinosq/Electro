import type Command from "../../commands/Command";
import { getCommand } from "../../commands/CommandRegistry";

export default class CLIProcessor {
	findCommand(commandText: string): Command | undefined {
		const command = getCommand(commandText);
		console.debug("952003", command);
		if (!command) {
			console.log(`Command not found: ${commandText}`);
			return;
		}

		return command;
	}

	async processCommand(command: Command): Promise<string> {
		return command
			.execute()
			.then((result) => {
				if (result === null || result === undefined) {
					return Promise.reject("Command executed with no result.");
				}

				return Promise.resolve(result);
			})
			.catch((error) => {
				console.error(error);
				return Promise.reject(error);
			});
	}
}
