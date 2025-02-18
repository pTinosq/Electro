import type Terminal from ".";

export default class CLICommand {
  name: string;
  description: string;
  commandString: string;
  callback: (terminal: Terminal, canExecute: boolean, ...args: string[]) => void;
  when: () => boolean;

  constructor(
    name: string,
    description: string,
    commandString: string,
    callback: (terminal: Terminal, isAllowed: boolean, ...args: string[]) => void,
    when: () => boolean
  ) {
    this.name = name;
    this.description = description;
    this.commandString = commandString;
    this.callback = callback;
    this.when = when;
  }

  execute(terminal: Terminal, ...args: string[]) {
    const isAllowed = this.when();
    this.callback(terminal, isAllowed, ...args);
  }
}
