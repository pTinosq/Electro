import Command from "./Command";

const CLICommands = [
	new Command(
		"test",
		"Test command",
		"test",
		() => {
			return "Test command executed";
		},
		() => {
			return true;
		},
	),
];

export default CLICommands;
