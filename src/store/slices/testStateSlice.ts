import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

interface TestState {
	value: boolean;
}

const initialState: TestState = {
	value: false,
};

const testStateSlice = createSlice({
	name: "testState",
	initialState,
	reducers: {
		setTestState: (state, action: PayloadAction<boolean>) => {
			state.value = action.payload;
		},
	},
});

export const { setTestState } = testStateSlice.actions;

export default testStateSlice.reducer;
