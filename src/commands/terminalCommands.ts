import { registerCommand } from ".";
import Command from "./Command";

const testCommand = new Command(
	"Test",
	"A test command used for testing",
	"terminal.test",
	"p",
	() => {
		console.log("Test command executed");
	},
);

registerCommand("terminal.test", testCommand);
