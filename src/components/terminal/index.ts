import { BaseComponent } from "../baseComponent";

export default class Terminal extends BaseComponent {
	private inputElement: HTMLInputElement;
	private historyElement: HTMLElement;
	private pathElement: HTMLElement;

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

		this.inputElement.addEventListener("keydown", (e: KeyboardEvent) =>
			this.handleInput(e),
		);
	}

	private handleInput(e: KeyboardEvent) {
		if (e.key === "Enter") {
			const inputValue = this.inputElement.value.trim();

			this.appendToHistory(inputValue);

			this.inputElement.value = "";
		}
	}

	private appendToHistory(text: string) {
		const newEntry = document.createElement("div");

		// Add a placeholder if the text is empty
		newEntry.innerHTML = text || "&nbsp;";
		this.historyElement.appendChild(newEntry);
	}

	protected updateUI() {
		const isOpen = this.getState((state) => state.terminal.isOpen);
		if (isOpen) {
			this.element.classList.add("open");
		} else {
			this.element.classList.remove("open");
		}
	}
}
