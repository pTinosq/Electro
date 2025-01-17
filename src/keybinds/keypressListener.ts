import { commandRegistry } from "../commands";

export function initializeKeyPressListener() {
	document.addEventListener("keyup", (event) => {
		console.log("Key pressed: ", event.key);
    commandRegistry["terminal.test"].execute();
	});
}
