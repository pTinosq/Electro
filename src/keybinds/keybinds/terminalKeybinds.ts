import store from "../../old.store";
import { setTerminalOpenState } from "../../old.store/slices/terminalSlice";
import Keybind from "../Keybind";

export const terminalKeybinds = [
  new Keybind(
    "Open terminal",
    "t",
    "Opens the terminal",
    (e) => {
      e.preventDefault();
      store.dispatch(setTerminalOpenState(true));
    },
    () => {
      // Do not open the terminal if it is already open
      return !store.getState().terminal.isOpen;
    }
  ),
  new Keybind(
    "Close terminal",
    "Escape",
    "Closes the terminal",
    (e) => {
      e.preventDefault();
      store.dispatch(setTerminalOpenState(false));
    },
    () => {
      // Only close the terminal if it is open
      return store.getState().terminal.isOpen;
    }
  ),
]