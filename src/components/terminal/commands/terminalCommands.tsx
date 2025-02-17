import CLICommand from "../CLICommand";

export const terminalCommands = [
  new CLICommand(
    "test",
    "Test command",
    "test",
    () => {
      console.log("Test command executed");
    },
    () => {
      return true;
    }
  )
]