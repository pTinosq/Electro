import { render } from "preact";
import App from "./App";
import CommandRegistry from "./commands/CommandRegistry";
import { invoke } from "@tauri-apps/api/core";
import { useTerminalStore } from "./stores/useTerminalStore";
import { homeDir } from "@tauri-apps/api/path";
import KeybindRegistry from "./keybinds/KeybindRegistry";

// Load all CLI commands before rendering
const commandRegistry = CommandRegistry.getInstance();
commandRegistry.loadCommands();

// Load all keybinds before rendering
const keybindRegistry = KeybindRegistry.getInstance();
keybindRegistry.loadKeybinds();
keybindRegistry.registerListener();

// Set CWD
homeDir().then(
  (homeDir) => {
    useTerminalStore.getState().setCwd(homeDir);
    invoke("change_cwd", { path: homeDir });
  }
)

render(<App />, document.getElementById("app") as HTMLElement);
