import store from "../store";
import { registerKeybind } from "../store/slices/keybindSlice";
import { addCommand } from "./CommandRegistry";
import terminalCommands from "./terminalCommands";
import CLICommands from "./CLICommands";
import type Command from "./Command";

export function loadAllCommands() {
	console.log("Loading all commands...");

	const allCommands: Command<unknown[], unknown>[] = [
		...terminalCommands,
		...CLICommands,
	];

	for (const command of allCommands) {
		addCommand(command);

		// Commands without keybinds are for the CLI
		if (command.keybind) {
			store.dispatch(
				registerKeybind({ keybind: command.keybind, commandId: command.id }),
			);
		}

		console.log(
			`Loaded command: ${command.id} with keybind: ${command.keybind}`,
		);
	}

	const state = store.getState();
	console.log(state.keybindRegistry);
}
