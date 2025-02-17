import store from "../../store";
import { setTerminalOpenState } from "../../store/slices/terminalSlice";
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
  )
]