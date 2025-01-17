import type { RootState } from "../store";
import store from "../store";

export default class Command<TArgs extends unknown[] = [], TReturn = void> {
	name: string;
	description: string;
	id: string;
	keybind: string;
	callback: (...args: TArgs) => TReturn | Promise<TReturn>;
	when: (state: RootState) => boolean;

	constructor(
		name: string,
		description: string,
		id: string,
		keybind: string,
		callback: (...args: TArgs) => TReturn | Promise<TReturn>,
		when: () => boolean = () => true,
	) {
		this.name = name;
		this.description = description;
		this.id = id;
		this.keybind = keybind;
		this.callback = callback;
		this.when = when;
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
