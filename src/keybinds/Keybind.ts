export default class Keybind {
  name: string;
  shortcut: string;
  description: string;
  callback: (event: KeyboardEvent) => void;
  when: () => boolean;

  constructor(
    name: string,
    shortcut: string,
    description: string,
    callback: (event: KeyboardEvent) => void,
    when: () => boolean = () => true // Defaults to always executable
  ) {
    this.name = name;
    this.shortcut = shortcut;
    this.description = description;
    this.callback = callback;
    this.when = when;
  }

  execute(event: KeyboardEvent) {
    if (this.when()) {
      this.callback(event);
    } else {
      console.warn(`Keybind "${this.shortcut}" cannot be executed due to unmet conditions.`);
    }
  }
}
