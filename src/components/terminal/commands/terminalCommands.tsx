import store from "../../../old.store";
import { setTerminalOpenState } from "../../../old.store/slices/terminalSlice";
import { setCwd } from "../../../utils/cwdUtils";
import CLICommand from "../../../commands/CLICommand";
import { invoke } from "@tauri-apps/api/core";
import { useTerminalStore } from "../../../stores/useTerminalStore";

// These commands handle the Electro terminal
export const terminalCommands = [
  new CLICommand(
    "Close terminal",
    "Close the terminal",
    "close",
    () => {
      useTerminalStore.getState().setIsTerminalOpen(false);
    },
    () => {
      return useTerminalStore.getState().isTerminalOpen;
    }
  ),
  new CLICommand(
    "Clear terminal",
    "Clear the terminal",
    "clear",
    () => {
      useTerminalStore.getState().clearHistory();
    },
    () => true

  ),
  new CLICommand(
    "Get current working directory",
    "Get the current working directory",
    "cwd",
    async () => {
      const state = useTerminalStore.getState();
      state.addHistory(`Current working directory: ${state.cwd}`);
    },
    () => true
  ),
  new CLICommand(
    "Launch file explorer",
    "Launches the file explorer in the specified directory",
    "explorer",
    (_, path) => {
      invoke("open_file_explorer", { path });
    },
    () => true
  ),
  new CLICommand(
    "Change directory",
    "Change the current working directory",
    "cd",
    async (_, path) => {
      const store = useTerminalStore.getState();
      if (!path) {
        store.addHistory("Error: No path provided");
        return;
      }

      try {
        const newPath = await invoke("change_cwd", { path }) as string;
        store.setCwd(newPath);
        store.addHistory(`Changed directory to: ${newPath}`);
      } catch (error) {
        store.addHistory(`Error: ${error}`);
      }
    },
    () => true
  ),
];
