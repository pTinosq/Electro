import type { RootState } from "../store";
import store from "../store";

export default class Command<TArgs extends unknown[] = [], TReturn = void> {
	name: string;
	description: string;
	id: string;
	callback: (...args: TArgs) => TReturn | Promise<TReturn>;
	when: (state: RootState) => boolean;
	keybind?: string;

	constructor(
		name: string,
		description: string,
		id: string,
		callback: (...args: TArgs) => TReturn | Promise<TReturn>,
		when: () => boolean = () => true,
		keybind?: string,
	) {
		this.name = name;
		this.description = description;
		this.id = id;
		this.callback = callback;
		this.when = when;
		this.keybind = keybind;
	}

	async execute(...args: TArgs): Promise<TReturn | null> {
		const state = store.getState(); // Fetch the current Redux state
		if (this.when(state)) {
			return await this.callback(...args);
		}

		console.warn(
			`Command "${this.name}" cannot be executed due to unmet conditions.`,
		);
		return null;
	}
}
