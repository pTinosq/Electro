import { invoke } from "@tauri-apps/api/core";
import CLICommand from "../CLICommand";

// These commands control the Electro app
export const electroCommands = [
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
