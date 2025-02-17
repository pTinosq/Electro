import type CLICommand from "./CLICommand";

export default class CommandRegistry {
  private static instance: CommandRegistry;
  private commands: Map<string, CLICommand>;

  private constructor() {
    this.commands = new Map();
  }

  static getInstance(): CommandRegistry {
    if (!CommandRegistry.instance) {
      CommandRegistry.instance = new CommandRegistry();
    }
    return CommandRegistry.instance;
  }

  addCommand(command: CLICommand): void {
    if (this.commands.has(command.commandString)) {
      throw new Error(`Command "${command.commandString}" already exists.`);
    }
    this.commands.set(command.commandString, command);
  }

  removeCommand(commandString: string): void {
    if (!this.commands.has(commandString)) {
      throw new Error(`Command "${commandString}" not found.`);
    }
    this.commands.delete(commandString);
  }

  getCommand(commandString: string): CLICommand | undefined {
    return this.commands.get(commandString);
  }

  listCommands(): CLICommand[] {
    return Array.from(this.commands.values());
  }
}