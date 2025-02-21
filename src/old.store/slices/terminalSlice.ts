import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { invoke } from "@tauri-apps/api/core";

interface TerminalState {
	isOpen: boolean;
	isTerminalInputFocused: boolean;
	cwd: string;
}

const initialState: TerminalState = {
	isOpen: false,
	isTerminalInputFocused: false,
	cwd: (await invoke("get_cwd")) ?? "/",
};

const terminalSlice = createSlice({
	name: "terminal",
	initialState,
	reducers: {
		setTerminalOpenState: (state, action: PayloadAction<boolean>) => {
			state.isOpen = action.payload;
		},
		toggleTerminal: (state) => {
			state.isOpen = !state.isOpen;
		},
		setTerminalInputFocus: (state, action: PayloadAction<boolean>) => {
			state.isTerminalInputFocused = action.payload;
		},
		setCwd: (state, action: PayloadAction<string>) => {
			state.cwd = action.payload;
		},
	},
});

export const {
	setTerminalOpenState,
	toggleTerminal,
	setTerminalInputFocus,
	setCwd,
} = terminalSlice.actions;

export default terminalSlice.reducer;
