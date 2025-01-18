import { BaseComponent } from "../baseComponent";

export default class Terminal extends BaseComponent {
	constructor(selector: string) {
		super(selector);

		console.log("Terminal initialized");
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
