import { invoke } from "@tauri-apps/api/core";
import CLICommand from "../../../commands/CLICommand";
import CommandRegistry from "../../../commands/CommandRegistry";
import { useTerminalStore } from "../../../stores/useTerminalStore";
import CLICommandCategory from "../../../commands/CLICommandCategory";

// These commands control the Electro app
export const electroCommands = [
	new CLICommand(
		"Quit",
		"Quits Electro",
		"quit",
		async () => {
			await invoke("exit_app");
		},
		() => true,
	),
	new CLICommand(
		"Help",
		"Displays help information",
		"help",
		async (_, token) => {
			if (token) {
				// Return help for a specific command
				const command = CommandRegistry.getInstance().getCommand(token);

				if (command) {
					useTerminalStore.getState().addHistory({
						type: "output",
						value: `${command.name} (${command.commandString})`,
					});

					useTerminalStore.getState().addHistory({
						type: "output",
						value: `${command.description}`,
					});
				} else {
					useTerminalStore.getState().addHistory({
						type: "output",
						value: `Command '${token}' not found`,
						variant: "error",
					});
				}
			} else {
				// Return a list of all commands
				const allCommands = CommandRegistry.allCommands;

				for (const category of allCommands) {
					useTerminalStore.getState().addHistory({
						type: "output",
						value: `${category.getCategory()} commands`,
						variant: "success",
					});

					for (const command of category.getCommands()) {
						useTerminalStore.getState().addHistory({
							type: "output",
							value: `${command.commandString} - ${command.description}`,
						});
					}
				}
			}
		},
		() => true,
	),
	new CLICommand(
		"Version",
		"Displays the version of Electro",
		"version",
		async () => {
			const version = await invoke("get_version");
			useTerminalStore.getState().addHistory({
				type: "output",
				value: `Electro version: ${version}`,
			});
		},
		() => true,
	),
];

export const electroCommandsCategory = new CLICommandCategory(
	"Electro",
	electroCommands,
);
