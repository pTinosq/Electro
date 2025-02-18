import store from "../../../store";
import { setTerminalOpenState } from "../../../store/slices/terminalSlice";
import CLICommand from "../CLICommand";

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
  )
];
