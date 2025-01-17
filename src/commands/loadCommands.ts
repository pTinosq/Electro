import store from "../store";
import { registerKeybind } from "../store/slices/keybindSlice";
import { addCommand } from "./CommandRegistry";
import terminalCommands from "./terminalCommands";

export function loadAllCommands() {
	console.log("Loading all commands...");

	for (const command of terminalCommands) {
		addCommand(command);

		store.dispatch(
			registerKeybind({ keybind: command.keybind, commandId: command.id }),
		);

		console.log(
			`Loaded command: ${command.id} with keybind: ${command.keybind}`,
		);
	}

	const state = store.getState();
	console.log(state.keybindRegistry);
}
