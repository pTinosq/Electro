import type Command from "./Command";

export const commandRegistry: Record<string, Command> = {};

export function addCommand(command: Command) {
	if (!commandRegistry[command.id]) {
		commandRegistry[command.id] = command;
	}
}

export function removeCommand(commandId: string) {
	delete commandRegistry[commandId];
}

export function getCommand(commandId: string): Command | undefined {
	return commandRegistry[commandId];
}
