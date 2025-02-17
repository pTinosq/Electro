import type { BaseComponent } from "../components/baseComponent";
import Terminal from "../components/terminal";

export class UIProcessor {
	private components: BaseComponent[] = [];

	initialize() {
		// Initialize UI components here
		const terminal = new Terminal("#terminal");
		terminal.loadCommands();

		this.components.push(terminal);
	}

	start() {
		console.log("UIProcessor: Starting all UI components...");
		for (const component of this.components) {
			component.refresh(); // Use the public refresh method
		}
	}
}
