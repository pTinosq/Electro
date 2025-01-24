import type KeybindProcessor from "./KeybindProcessor";

export default class KeybindListener {
	private keybindProcessor: KeybindProcessor;

	constructor(keybindProcessor: KeybindProcessor) {
		this.keybindProcessor = keybindProcessor;
	}

	start() {
		window.addEventListener("keyup", this.handleKeypress);
	}

	stop() {
		window.removeEventListener("keyup", this.handleKeypress);
	}

	private handleKeypress = (event: KeyboardEvent) => {
		const key = event.key;
		this.keybindProcessor.processKeypress(key);
	};
}
