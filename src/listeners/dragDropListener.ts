import { listen } from "@tauri-apps/api/event";

interface DragDropEvent {
	payload: {
		paths: string[];
		position: {
			x: number;
			y: number;
		};
	};
}

// Listens for incoming drag-drop events from Tauri backend
export function initializeDragDropListener(
	callback: (imageUri: string) => void,
): void {
	listen("tauri://drag-drop", (event) => {
		const dragDropEvent = event as DragDropEvent;
		const imageUri = dragDropEvent.payload.paths[0];
		callback(imageUri);
	});
}
