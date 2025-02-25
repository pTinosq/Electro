import { useTerminalStore } from "../../stores/useTerminalStore";
import Keybind from "../Keybind";

export const imageKeybinds = [
	new Keybind(
		"image.previous",
		"Previous image",
		"ARROWLEFT",
		() => {
			console.log("Previous image");
		},
		() => {
			return true;
		},
	),
	new Keybind(
		"image.next",
		"Next image",
		"ARROWRIGHT",
		() => {
			console.log("Next image");
		},
		() => {
			return true;
		},
	),
];
