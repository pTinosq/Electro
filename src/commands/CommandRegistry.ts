import { electroCommandsCategory } from "../components/Terminal/commands/electroCommands";
import { imageCommandsCategory } from "../components/Terminal/commands/imageCommands";
import { terminalCommandsCategory } from "../components/Terminal/commands/terminalCommands";
import type CLICommand from "./CLICommand";
import type CLICommandCategory from "./CLICommandCategory";

export default class CommandRegistry {
  private static instance: CommandRegistry;
  private commands: Map<string, CLICommand>;
  public static allCommands: CLICommandCategory[] = [
    terminalCommandsCategory,
    electroCommandsCategory,
    imageCommandsCategory
  ];


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
      console.warn(`Command "${command.commandString}" already exists and will be overwritten.`);
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

  autocompleteCommand(commandString: string): string[] {
    return Array.from(this.commands.keys()).filter((key) =>
      key.startsWith(commandString)
    );
  }

  public loadCommands() {
    for (const commandCategory of CommandRegistry.allCommands) {
      for (const command of commandCategory.getCommands()) {
        this.addCommand(command);
      }
    }
  }
}