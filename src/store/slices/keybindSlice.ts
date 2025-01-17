import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

interface KeybindRegistryState {
	keybinds: Record<string, string[]>; // Maps keybinds to arrays of command IDs
}

const initialState: KeybindRegistryState = {
	keybinds: {}, // Start with no keybinds
};

const keybindSlice = createSlice({
	name: "keybindRegistry",
	initialState,
	reducers: {
		registerKeybind: (
			state,
			action: PayloadAction<{ keybind: string; commandId: string }>
		) => {
			const { keybind, commandId } = action.payload;
			if (!state.keybinds[keybind]) {
				state.keybinds[keybind] = [];
			}
			if (!state.keybinds[keybind].includes(commandId)) {
				state.keybinds[keybind].push(commandId);
			}
		},
		unregisterKeybind: (
			state,
			action: PayloadAction<{ keybind: string; commandId: string }>
		) => {
			const { keybind, commandId } = action.payload;
			state.keybinds[keybind] = state.keybinds[keybind]?.filter(
				(id) => id !== commandId
			);
			if (state.keybinds[keybind]?.length === 0) {
				delete state.keybinds[keybind];
			}
		},
		clearKeybinds: (state) => {
			state.keybinds = {};
		},
	},
});

export const { registerKeybind, unregisterKeybind, clearKeybinds } = keybindSlice.actions;

export default keybindSlice.reducer;
