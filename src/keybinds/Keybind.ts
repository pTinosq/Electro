export default class Keybind {
	id: string;
	name: string;
	shortcut: Uppercase<string>;
	callback: (
		canExecute: boolean,
		event: KeyboardEvent,
		...args: string[]
	) => void;
	when: () => boolean;

	constructor(
		id: string,
		name: string,
		shortcut: Uppercase<string>,
		callback: (
			isAllowed: boolean,
			event: KeyboardEvent,
			...args: string[]
		) => void,
		when: () => boolean,
	) {
		this.id = id;
		this.name = name;
		this.shortcut = shortcut;
		this.callback = callback;
		this.when = when;
	}

	execute(event: KeyboardEvent, ...args: string[]) {
		const isAllowed = this.when();
		this.callback(isAllowed, event, ...args);
	}
}
