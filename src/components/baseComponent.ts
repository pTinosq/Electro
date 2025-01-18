import store, { type RootState } from "../store";

export abstract class BaseComponent {
	protected element: HTMLElement;

	constructor(selector: string) {
		const el = document.querySelector(selector);
		if (!el) {
			throw new Error(`Element not found for selector: ${selector}`);
		}
		this.element = el as HTMLElement;
		this.initialize();
	}

	protected initialize() {
		this.updateUI();
		store.subscribe(() => this.updateUI());
	}

	protected abstract updateUI(): void;

	public refresh() {
		this.updateUI();
	}

	// Utility to retrieve state from the Redux store
	protected getState<T>(selector: (state: RootState) => T): T {
		return selector(store.getState());
	}
}
