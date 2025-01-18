import { configureStore } from "@reduxjs/toolkit";
import testStateReducer from "./slices/testStateSlice";
import keybindRegistrySlice from "./slices/keybindSlice";
import terminalSlice from "./slices/terminalSlice";

const store = configureStore({
	reducer: {
		testState: testStateReducer,
		keybindRegistry: keybindRegistrySlice,
		terminal: terminalSlice,
	},
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
