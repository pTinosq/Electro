import type KeybindProcessor from "./KeybindProcessor";

export default class KeybindListener {
	private keybindProcessor: KeybindProcessor;

	constructor(keybindProcessor: KeybindProcessor) {
		this.keybindProcessor = keybindProcessor;
	}

	start() {
		window.addEventListener("keydown", this.handleKeypress);
	}

	stop() {
		window.removeEventListener("keydown", this.handleKeypress);
	}

	private handleKeypress = (event: KeyboardEvent) => {
		const key = event.key;
		this.keybindProcessor.processKeypress(event, key);
	};
}
