import store from "../store";
import Command from "./Command";

const terminalCommands = [
	new Command(
		"terminal.test",
		"Test command",
		"terminal.test",
		"t",
		() => {
			console.log("Test command executed");
		},
		() => {
			// test - ignore
			const state = store.getState();
			return true;
		},
	),
];

export default terminalCommands;
