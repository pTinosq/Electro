import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

interface TerminalState {
	isOpen: boolean;
	isTerminalInputFocused: boolean;
}

const initialState: TerminalState = {
	isOpen: false,
	isTerminalInputFocused: false,
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
	},
});

export const { setTerminalOpenState, toggleTerminal, setTerminalInputFocus } =
	terminalSlice.actions;

export default terminalSlice.reducer;
