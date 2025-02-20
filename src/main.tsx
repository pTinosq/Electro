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
const homeDirectory = await homeDir();
useTerminalStore.getState().setCwd(homeDirectory);
invoke("change_cwd", { path: homeDirectory });


render(<App />, document.getElementById("app") as HTMLElement);
