import type Keybind from "./Keybind";

export default class KeybindRegistry {
  private static instance: KeybindRegistry;
  private keybinds: Map<string, Keybind>;

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

  registerListener(): void {
    window.addEventListener("keydown", (event) => this.handleKeyPress(event));
  }

  private normalizeShortcut(event: KeyboardEvent): string {
    const keys = [];
    if (event.ctrlKey) keys.push("Ctrl");
    if (event.shiftKey) keys.push("Shift");
    if (event.altKey) keys.push("Alt");
    if (event.metaKey) keys.push("Meta");
    keys.push(event.key);
    return keys.join("+");
  }
}