import store from "../../store";
import { setTerminalInputFocus } from "../../store/slices/terminalSlice";
import { BaseComponent } from "../baseComponent";
import CommandRegistry from "./CommandRegistry";
import { electroCommands } from "./commands/electroCommands";
import { imageCommands } from "./commands/imageCommands";
import { terminalCommands } from "./commands/terminalCommands";

export default class Terminal extends BaseComponent {
	private inputElement: HTMLInputElement;
	private historyElement: HTMLElement;
	private pathElement: HTMLElement;
	private commandRegistry: CommandRegistry = CommandRegistry.getInstance();

	constructor(selector: string) {
		super(selector);

		this.inputElement = this.element.querySelector(
			"#terminal-input",
		) as HTMLInputElement;
		this.historyElement = this.element.querySelector(
			"#terminal-history",
		) as HTMLElement;
		this.pathElement = this.element.querySelector("#terminal-path") as HTMLElement;

		if (!this.inputElement || !this.historyElement || !this.pathElement) {
			throw new Error(
				"Required terminal elements not found within the component.",
			);
		}



		this.addEventListeners();
	}


	private addEventListeners() {
		// When the terminal is clicked, focus the input
		this.element.addEventListener("click", () => {
			this.inputElement.focus();
		});

		this.inputElement.addEventListener("keydown", (e: KeyboardEvent) => {
			this.handleInput(e);
		});

		this.inputElement.addEventListener("focus", () => {
			store.dispatch(setTerminalInputFocus(true));
		});

		this.inputElement.addEventListener("blur", () => {
			store.dispatch(setTerminalInputFocus(false));
		});
	}

	private handleInput(e: KeyboardEvent) {
		// Submit the input when the user presses Enter
		if (e.key === "Enter") {
			const inputValue = this.inputElement.value.trim();
			const inputTokens = inputValue.split(" ");

			// Add a prompt to the input value
			const formattedInputValue = `> ${inputValue}`;
			this.appendToHistory(formattedInputValue);
			this.inputElement.value = "";
			const command = this.commandRegistry.getCommand(inputTokens[0]);

			if (command) {
				command.execute(this, ...(inputTokens.slice(1)));
			} else {
				if (inputTokens[0].trim() !== "") {
					this.appendToHistory(`Command not found: ${inputTokens[0]}`);
				}
			}
		}

		// Autocomplete the input when the user presses Tab
		if (e.key === "Tab") {
			e.preventDefault();

			// For now we'll only provide autocomplete for the first token
			const inputValue = this.inputElement.value.trim();
			const inputTokens = inputValue.split(" ");

			if (inputTokens.length === 1 && inputTokens[0].trim() !== "") {
				const commands = this.commandRegistry.autocompleteCommand(inputTokens[0]);

				if (commands.length === 1) {
					this.inputElement.value = commands[0];

				} else if (commands.length > 1) {
					this.appendToHistory(`${commands.join(", ")}`);
				}
			}
		}
	}

	// Appends a new entry to the terminal history
	public appendToHistory(text: string) {
		const newEntry = document.createElement("div");

		// Add a placeholder if the text is empty
		newEntry.innerHTML = text || "&nbsp;";
		this.historyElement.appendChild(newEntry);

		// scroll to the bottom of history element
		this.historyElement.scrollTo(0, this.historyElement.scrollHeight);
	}

	// Clears the terminal history
	public clearHistory() {
		this.historyElement.innerHTML = "";
	}

	protected updateUI() {
		const terminalState = this.getState((state) => state.terminal);

		// Reflect terminal open state
		if (terminalState.isOpen) {
			this.element.classList.add("open");

			// Focus input when terminal is first opened
			if (document.activeElement !== this.inputElement) {
				this.inputElement.focus();
			}
		} else {
			this.element.classList.remove("open");
		}
	}

	public loadCommands() {
		console.debug("Loading terminal commands...");
		const registry = CommandRegistry.getInstance();

		// Register commands
		const allCommands = [
			...terminalCommands,
			...electroCommands,
			...imageCommands
		];

		for (const command of allCommands) {
			registry.addCommand(command);
		}
	}

	public setPath(path: string) {
		this.pathElement.innerHTML = `${path}>`;
	}
}


