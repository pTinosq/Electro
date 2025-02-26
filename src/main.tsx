import { render } from "preact";
import App from "./App";
import CommandRegistry from "./commands/CommandRegistry";
import { useTerminalStore } from "./stores/useTerminalStore";
import { homeDir } from "@tauri-apps/api/path";
import KeybindRegistry from "./keybinds/KeybindRegistry";
import { normalizeFilePath } from "./utils/normalizeFilePaths";

export const SUPPORTED_FILE_EXTENSIONS = [
	"png",
	"apng",
	"avif",
	"gif",
	"jpg",
	"jpeg",
	"jfif",
	"pjpeg",
	"pjp",
	"svg",
	"webp",
	"bmp",
	"ico",
	"cur",
];

// Load all CLI commands before rendering
const commandRegistry = CommandRegistry.getInstance();
commandRegistry.loadCommands();

// Load all keybinds before rendering
const keybindRegistry = KeybindRegistry.getInstance();
keybindRegistry.loadKeybinds();
keybindRegistry.registerListener();

// Set CWD
homeDir().then((homeDir) => {
	const normalziedHomeDir = normalizeFilePath(homeDir);
	useTerminalStore.getState().setCwd(normalziedHomeDir);
});

render(<App />, document.getElementById("app") as HTMLElement);
