import { convertFileSrc } from "@tauri-apps/api/core";
import { useImageStore } from "../../stores/useImageStore";
import Keybind from "../Keybind";

export const imageKeybinds = [
	new Keybind(
		"image.previous",
		"Previous image",
		"ARROWLEFT",
		() => {
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
		() => {
			return true;
		},
	),
	new Keybind(
		"image.next",
		"Next image",
		"ARROWRIGHT",
		() => {
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
		() => {
			return true;
		},
	),
];
