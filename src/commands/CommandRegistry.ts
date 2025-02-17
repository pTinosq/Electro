import type Command from "./Command";

export const commandRegistry: Record<string, Command<unknown[], unknown>> = {};

export function addCommand<TArgs extends unknown[], TReturn>(
	command: Command<TArgs, TReturn>,
) {
	if (!commandRegistry[command.id]) {
		commandRegistry[command.id] = command as Command<unknown[], unknown>; // Type assertion
	}
}

export function removeCommand(commandId: string) {
	delete commandRegistry[commandId];
}

export function getCommand(
	commandId: string,
): Command<unknown[], unknown> | undefined {
	return commandRegistry[commandId];
}
