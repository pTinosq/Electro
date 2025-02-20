import { invoke } from "@tauri-apps/api/core";
import CLICommand from "../../../commands/CLICommand";

// These commands control the Electro app
export const electroCommands = [
  new CLICommand(
    "quit",
    "Quit Electro",
    "quit",
    async () => {
      await invoke("exit_app");
    },
    () => true
  )
];
