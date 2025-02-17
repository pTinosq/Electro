export default class CLICommand {
  name: string;
  description: string;
  commandString: string;
  callback: () => void;
  when: () => boolean;

  constructor(name: string, description: string, commandString: string, callback: () => void, when: () => boolean) {
    this.name = name;
    this.description = description;
    this.commandString = commandString;
    this.callback = callback;
    this.when = when;
  }

  execute() {
    if (this.when()) {
      this.callback();
    } else {
      console.warn(`Command "${this.name}" cannot be executed due to unmet conditions.`);
    }
  }
}