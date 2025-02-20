import { render } from "preact";
import App from "./App";
import CommandRegistry from "./commands/CommandRegistry";
import { invoke } from "@tauri-apps/api/core";
import { useTerminalStore } from "./stores/useTerminalStore";
import { homeDir } from "@tauri-apps/api/path";

const commandRegistry = CommandRegistry.getInstance();
// Load all CLI commands before rendering
commandRegistry.loadCommands();

// Set CWD
const homeDirectory = await homeDir();
useTerminalStore.getState().setCwd(homeDirectory);
invoke("change_cwd", { path: homeDirectory });


render(<App />, document.getElementById("app") as HTMLElement);
