import { useTerminalStore } from "../../stores/useTerminalStore";
import Keybind from "../Keybind";

export const terminalKeybinds = [
	new Keybind(
		"terminal.open",
		"Open terminal",
		"T",
		() => {
			useTerminalStore.setState({ isTerminalOpen: true });
		},
		() => {
			return !useTerminalStore.getState().isTerminalOpen;
		},
	),
	new Keybind(
		"terminal.close",
		"Close terminal",
		"ESCAPE",
		() => {
			useTerminalStore.setState({ isTerminalOpen: false });
		},
		() => {
			return useTerminalStore.getState().isTerminalOpen;
		},
	),
];
