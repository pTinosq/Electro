import { convertFileSrc } from "@tauri-apps/api/core";
import { useImageStore } from "../../stores/useImageStore";
import Keybind from "../Keybind";
import { useTerminalStore } from "../../stores/useTerminalStore";

export const imageKeybinds = [
	new Keybind(
		"image.previous",
		"Previous image",
		"ARROWLEFT",
		(isAllowed) => {
			if (!isAllowed) return;
			const previousImage = useImageStore.getState().siblingImagePaths.previous()

			if (previousImage) {
				const image = new Image();
				image.src = convertFileSrc(previousImage);
				image.onload = () => {
					useImageStore.getState().setDefaultSrc(previousImage);
					useImageStore.getState().setLoadedImage(image);
				}
			}
		},
		() => !useTerminalStore.getState().isTerminalInputFocused

	),
	new Keybind(
		"image.next",
		"Next image",
		"ARROWRIGHT",
		(isAllowed) => {
			if (!isAllowed) return;
			const nextImage = useImageStore.getState().siblingImagePaths.next()

			if (nextImage) {
				const image = new Image();
				image.src = convertFileSrc(nextImage);
				image.onload = () => {
					useImageStore.getState().setDefaultSrc(nextImage);
					useImageStore.getState().setLoadedImage(image);
				}
			}
		},
		() => !useTerminalStore.getState().isTerminalInputFocused

	),
];
