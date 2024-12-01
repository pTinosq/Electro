import { listen } from "@tauri-apps/api/event";
import { invoke } from "@tauri-apps/api/core";

interface ImageSourceEvent {
	payload: {
		value: string;
	};
}

// Listens for incoming image source events from Tauri backend
export function initializeImageSourceListener(
	callback: (imageUri: string) => void,
): void {
	listen("image-source", (event: ImageSourceEvent) => {
		const imageUri = event.payload.value;
		callback(imageUri);
	}).then(() => {
		invoke("on_image_source_listener_ready");
	});
}
