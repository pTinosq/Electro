import type Keybind from "./Keybind";
import { terminalKeybinds } from "./keybinds/terminalKeybinds";

export default class KeybindRegistry {
	private static instance: KeybindRegistry;
	private keybinds: Map<string, Keybind>;
	public static allKeybinds: Keybind[] = [...terminalKeybinds];

	private constructor() {
		this.keybinds = new Map();
	}

	static getInstance(): KeybindRegistry {
		if (!KeybindRegistry.instance) {
			KeybindRegistry.instance = new KeybindRegistry();
		}
		return KeybindRegistry.instance;
	}

	addKeybind(keybind: Keybind): void {
		if (this.keybinds.has(keybind.shortcut)) {
			throw new Error(`Keybind "${keybind.shortcut}" already exists.`);
		}
		this.keybinds.set(keybind.shortcut, keybind);
	}

	removeKeybind(shortcut: string): void {
		if (!this.keybinds.has(shortcut)) {
			throw new Error(`Keybind "${shortcut}" not found.`);
		}
		this.keybinds.delete(shortcut);
	}

	getKeybind(shortcut: string): Keybind | undefined {
		return this.keybinds.get(shortcut);
	}

	listKeybinds(): Keybind[] {
		return Array.from(this.keybinds.values());
	}

	private handleKeyPress(event: KeyboardEvent) {
		const shortcut = this.normalizeShortcut(event);
		const keybind = this.keybinds.get(shortcut);
		if (keybind) {
			keybind.execute(event);
		}
	}

	public registerListener(): void {
		window.addEventListener("keydown", (event) => this.handleKeyPress(event));
	}

	public loadKeybinds(): void {
		for (const keybind of KeybindRegistry.allKeybinds) {
			this.addKeybind(keybind);
		}
	}

	private normalizeShortcut(event: KeyboardEvent): string {
		const keys = [];
		if (event.ctrlKey) keys.push("CTRL");
		if (event.shiftKey) keys.push("SHIFT");
		if (event.altKey) keys.push("ALT");
		if (event.metaKey) keys.push("META");
		// all keys are in uppercase
		const key = event.key.toUpperCase();
		keys.push(key);
		return keys.join("+");
	}
}
