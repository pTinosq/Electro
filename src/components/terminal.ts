import { BaseComponent } from "./baseComponent";

export class Terminal extends BaseComponent {
	constructor(selector: string) {
		super(selector);
		this.element.classList.add("open");
		console.log("Terminal initialized");
	}

	// Update the UI based on the state
	protected updateUI() {
		const isOpen = this.getState((state) => state.terminal.isOpen);
		if (isOpen) {
			this.element.classList.add("open");
		} else {
			this.element.classList.remove("open");
		}
	}
}
