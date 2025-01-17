import type Command from "./Command";

export const commandRegistry: { [commandName: string]: Command } = {};

export function registerCommand(commandId: string, command: Command): void {
	commandRegistry[commandId] = command;
}
