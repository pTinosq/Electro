export default class Command<TArgs extends unknown[] = [], TReturn = void> {
	name: string;
	description: string;
	id: string;
	keybind: string;
	callback: (...args: TArgs) => TReturn | Promise<TReturn>;

	constructor(
		name: string,
		description: string,
		id: string,
		keybind: string,
		callback: (...args: TArgs) => TReturn | Promise<TReturn>,
	) {
		this.name = name;
		this.description = description;
		this.id = id;
		this.keybind = keybind;
		this.callback = callback;
	}

	async execute(...args: TArgs): Promise<TReturn> {
		return await this.callback(...args);
	}
}
