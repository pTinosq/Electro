import store from "../store";
import { toggleTerminal } from "../store/slices/terminalSlice";
import Command from "./Command";

const terminalCommands = [
	new Command(
		"terminal.toggle",
		"Toggle the terminal",
		"terminal.toggle",
		"t",
		() => {
			store.dispatch(toggleTerminal());
		},
		() => {
			return true;
		},
	),
];

export default terminalCommands;
