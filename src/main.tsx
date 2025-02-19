import { render } from "preact";
import App from "./App";
import CommandRegistry from "./commands/CommandRegistry";

const commandRegistry = CommandRegistry.getInstance();
// Load all CLI commands before rendering
commandRegistry.loadCommands();

render(<App />, document.getElementById("app") as HTMLElement);
