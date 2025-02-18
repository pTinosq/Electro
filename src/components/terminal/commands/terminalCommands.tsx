import store from "../../../old.store";
import { setTerminalOpenState } from "../../../old.store/slices/terminalSlice";
import { setCwd } from "../../../utils/cwdUtils";
import CLICommand from "../CLICommand";
import { invoke } from "@tauri-apps/api/core";

// These commands handle the Electro terminal
export const terminalCommands = [
  new CLICommand(
    "Close terminal",
    "Close the terminal",
    "close",
    () => {
      store.dispatch(setTerminalOpenState(false));
    },
    () => {
      return store.getState().terminal.isOpen;
    }
  ),
  new CLICommand(
    "Clear terminal",
    "Clear the terminal",
    "clear",
    (terminal) => {
      terminal.clearHistory();
      store.dispatch(setTerminalOpenState(true));
    },
    () => {
      return store.getState().terminal.isOpen;
    }
  ),
  new CLICommand(
    "Get current working directory",
    "Get the current working directory",
    "cwd",
    async (terminal) => {
      terminal.appendToHistory(store.getState().terminal.cwd);
    },
    () => true
  ),
  new CLICommand(
    "Launch file explorer",
    "Launches the file explorer in the specified directory",
    "explorer",
    (_0, _1, path) => {
      invoke("open_file_explorer", { path });
    },
    () => true
  ),
  new CLICommand(
    "Change directory",
    "Change the current working directory",
    "cd",
    async (terminal, _isAllowed, path) => {
      if (!path) {
        terminal.appendToHistory("Error: No path provided");
        return;
      }

      try {
        const newPath = await invoke("change_cwd", { path }) as string;
        setCwd(newPath);
        terminal.appendToHistory(`Changed directory to: ${newPath}`);
      } catch (error) {
        terminal.appendToHistory(`Error: ${error}`);
      }
    },
    () => true
  ),
];
