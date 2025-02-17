import CLICommand from "../CLICommand";

export const terminalCommands = [
  new CLICommand(
    "test",
    "Test command",
    "test",
    (isAllowed) => {
      if (!isAllowed) {
        console.log("Command is not allowed");
      } else {
        console.log("Test command executed");
      }
    },
    () => {
      return Math.random() > 0.5;
    }
  )
]