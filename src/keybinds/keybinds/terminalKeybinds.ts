import Keybind from "../Keybind";

export const terminalKeybinds = [
  new Keybind(
    "Open terminal",
    "t",
    "Opens the terminal",
    () => {
      console.log("Opening terminal");
    },
    () => {
      return true;
    }
  )
]