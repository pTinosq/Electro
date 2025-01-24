import type Command from "../../commands/Command";
import store from "../../store";
import { setTerminalInputFocus } from "../../store/slices/terminalSlice";
import { BaseComponent } from "../baseComponent";
import CLIProcessor from "./CLIProcessor";

export default class Terminal extends BaseComponent {
	private inputElement: HTMLInputElement;
	private historyElement: HTMLElement;
	private pathElement: HTMLElement;
	private CLIProcessor: CLIProcessor = new CLIProcessor();

	constructor(selector: string) {
		super(selector);

		this.inputElement = this.element.querySelector(
			"#terminal-input",
		) as HTMLInputElement;
		this.historyElement = this.element.querySelector(
			"#terminal-history",
		) as HTMLElement;
		this.pathElement = this.element.querySelector("#path") as HTMLElement;

		if (!this.inputElement || !this.historyElement || !this.pathElement) {
			throw new Error(
				"Required terminal elements not found within the component.",
			);
		}

		this.addEventListeners();
	}

	private addEventListeners() {
		this.element.addEventListener("click", () => {
			this.inputElement.focus();
		});

		this.inputElement.addEventListener("keyup", (e: KeyboardEvent) => {
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
		if (e.key === "Enter") {
			const inputValue = this.inputElement.value.trim();

			// Add a prompt to the input value
			const formattedInputValue = `> ${inputValue}`;
			this.appendToHistory(formattedInputValue);
			this.inputElement.value = "";

			// Process the input value
			const inputtedCommand = this.CLIProcessor.findCommand(inputValue);

			if (inputtedCommand) {
				this.CLIProcessor.processCommand(inputtedCommand)
					.then((result) => {
						this.appendToHistory(result);
					})
					.catch((error) => {
						this.appendToHistory(error);
					});
			} else {
				if (inputValue) {
					this.appendToHistory(`Command not found: ${inputValue}`);
				}
			}
		}
	}

	// Appends a new entry to the terminal history
	private appendToHistory(text: string) {
		const newEntry = document.createElement("div");

		// Add a placeholder if the text is empty
		newEntry.innerHTML = text || "&nbsp;";
		this.historyElement.appendChild(newEntry);

		// scroll to the bottom of history element
		this.historyElement.scrollTo(0, this.historyElement.scrollHeight);
	}

	protected updateUI() {
		const terminalState = this.getState((state) => state.terminal);

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
}
