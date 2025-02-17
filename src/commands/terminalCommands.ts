import store from "../store";
import {
	setTerminalOpenState,
	toggleTerminal,
} from "../store/slices/terminalSlice";
import Command from "./Command";

const terminalCommands = [
	new Command(
		"terminal.toggle",
		"Toggle the terminal",
		"terminal.toggle",
		() => {
			store.dispatch(toggleTerminal());
		},
		() => {
			const isTerminalInputFocused =
				store.getState().terminal.isTerminalInputFocused;
			return !isTerminalInputFocused;
		},
		"t",
	),
	new Command(
		"terminal.close",
		"Close the terminal",
		"terminal.close",
		() => {
			store.dispatch(setTerminalOpenState(false));
		},
		() => {
			return store.getState().terminal.isOpen;
		},
		"Escape",
	),
	new Command(
		"terminal.autocomplete",
		"Autocomplete the current command",
		"terminal.autocomplete",
		() => {
			console.log("Autocompleting...");
		},
		() => {
			return (
				store.getState().terminal.isOpen &&
				store.getState().terminal.isTerminalInputFocused
			);
		},
		"Tab",
	),
];

export default terminalCommands;
