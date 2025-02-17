import { invoke } from "@tauri-apps/api/core";
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
    () => Math.random() > 0.5
  ),
  new CLICommand(
    "quit",
    "Quit Electro",
    "quit",
    async () => {
      console.log("Quitting Electro...");
      await invoke("exit_app");
    },
    () => true
  )
];
