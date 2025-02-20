import { convertFileSrc } from "@tauri-apps/api/core";
import store from "../old.store";

// Load an image from a URI and return a promise that resolves to the image element
export function loadImage(originalImageUri: string, shouldConvertFileSrc?: boolean): Promise<HTMLImageElement> {
	let imageUri = originalImageUri;

	if (shouldConvertFileSrc) {
		imageUri = convertFileSrc(imageUri);
	}

	return new Promise((resolve, reject) => {
		const image = new Image();
		image.src = imageUri;
		image.onload = () => {
			// Set the state of the image 
			store.dispatch({ type: "image/setDefaultSrc", payload: originalImageUri });
			store.dispatch({ type: "image/setSrc", payload: imageUri });

			resolve(image);
		}
		image.onerror = () =>
			reject(new Error(`Failed to load image from ${imageUri}`));
	});
}
