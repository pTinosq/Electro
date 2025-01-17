import store from "../store";
import { getCommand } from "../commands/CommandRegistry";

export default class KeybindProcessor {
	processKeypress(keypress: string): void {
		// Access the Redux state to get the keybindRegistry
		const state = store.getState();
		const commandIds: string[] =
			(state.keybindRegistry.keybinds[keypress] as unknown as string[]) || [];

		if (commandIds && commandIds.length > 0) {
			for (const commandId of commandIds) {
				const command = getCommand(commandId);
				if (command) {
					// Check if the command can execute
					if (command.when(state)) {
						command.execute();
					} else {
						console.warn(
							`Command "${command.id}" cannot be executed due to unmet conditions.`,
						);
					}
				} else {
					console.warn(`Command with ID "${commandId}" not found.`);
				}
			}
		} else {
			console.warn(`No commands registered for keypress: "${keypress}"`);
		}
	}
}
