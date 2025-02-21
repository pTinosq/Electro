import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

interface ImageState {
	defaultSrc: string | null;
	src: string | null;
}

const initialState: ImageState = {
	defaultSrc: null,
	src: null,
};

const imageSlice = createSlice({
	name: "image",
	initialState,
	reducers: {
		setDefaultSrc(state, action: PayloadAction<string>) {
			state.defaultSrc = action.payload;
		},
		setSrc(state, action: PayloadAction<string>) {
			state.src = action.payload;
		},
	},
});

export const { setDefaultSrc, setSrc } = imageSlice.actions;

export default imageSlice.reducer;
