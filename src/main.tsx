import { render } from "preact";
import App from "./App";
import CommandRegistry from "./commands/CommandRegistry";
import { invoke } from "@tauri-apps/api/core";
import { useTerminalStore } from "./stores/useTerminalStore";

const commandRegistry = CommandRegistry.getInstance();
// Load all CLI commands before rendering
commandRegistry.loadCommands();

// Set CWD
const cwd = await invoke("get_cwd") as string;
useTerminalStore.getState().setCwd(cwd);

render(<App />, document.getElementById("app") as HTMLElement);
