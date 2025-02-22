import { useEffect } from "preact/hooks";
import Canvas from "./components/canvas/Canvas";
import { listen } from "@tauri-apps/api/event";
import { useImageStore } from "./stores/useImageStore";
import { convertFileSrc, invoke } from "@tauri-apps/api/core";
import "./styles/normalize.css";
import "./styles/global.css";
import Terminal from "./components/terminal/Terminal";
import { useTerminalStore } from "./stores/useTerminalStore";
import { normalizeFilePath } from "./utils/normalizeFilePaths";

const DEFAULT_IMAGE_PATH = "assets/electro-default.jpg";
const DEV_DEFAULT_IMAGE_PATH = "/src/assets/electro-default.jpg";

interface DragDropEvent {
	payload: {
		paths: string[];
		position: {
			x: number;
			y: number;
		};
	};
}

interface ImageSourceEvent {
	payload: {
		source: {
			value: string;
		};
	};
}

const IS_DEV_MODE = import.meta.env.DEV;


export default function App() {
	const { loadedImage, setLoadedImage, setDefaultSrc } = useImageStore();

	// Load default image on mount
	useEffect(() => {
		const loadImage = async (path: string) => {
			const fileUrl = IS_DEV_MODE ? path : convertFileSrc(path);
			const img = new Image();
			img.src = fileUrl;
			img.onload = () => setLoadedImage(img);
		};

		// Load the default image
		loadImage(
			IS_DEV_MODE ? DEV_DEFAULT_IMAGE_PATH : DEFAULT_IMAGE_PATH
		);

		// Drag and drop listener
		listen("tauri://drag-drop", (event) => {
			const dragDropEvent = event as DragDropEvent;
			const filePath = normalizeFilePath(dragDropEvent.payload.paths[0]);

			const fileDirectory = filePath.split("/").slice(0, -1).join("/");
			useTerminalStore.getState().setCwd(fileDirectory);

			setDefaultSrc(filePath);
			loadImage(filePath);
		});

		listen("image-source", (event: ImageSourceEvent) => {
			const filePath = event.payload.source.value;
			if (!filePath) return;

			setDefaultSrc(filePath);
			loadImage(filePath);
		}).then(() => {
			invoke("on_image_source_listener_ready");
		});
	}, [setDefaultSrc, setLoadedImage]);

	return (
		<>
			<Terminal />
			<Canvas image={loadedImage} />
		</>
	);
}
