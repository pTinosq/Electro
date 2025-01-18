import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

interface TerminalState {
	isOpen: boolean;
}

const initialState: TerminalState = {
	isOpen: false,
};

const terminalSlice = createSlice({
	name: "terminal",
	initialState,
	reducers: {
		setTerminalState: (state, action: PayloadAction<boolean>) => {
			state.isOpen = action.payload;
		},

		toggleTerminal: (state) => {
			state.isOpen = !state.isOpen;
		},
	},
});

export const { setTerminalState, toggleTerminal } = terminalSlice.actions;

export default terminalSlice.reducer;
