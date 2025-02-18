import { configureStore } from "@reduxjs/toolkit";
import keybindRegistrySlice from "./slices/keybindSlice";
import terminalSlice from "./slices/terminalSlice";
import imageSlice from "./slices/imageSlice";

const store = configureStore({
	reducer: {
		keybindRegistry: keybindRegistrySlice,
		terminal: terminalSlice,
		image: imageSlice
	},
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
