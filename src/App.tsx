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
const IS_DEV_MODE = import.meta.env.DEV;

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

export default function App() {
	const { loadedImage, setLoadedImage, setDefaultSrc, loadSiblingImagePaths } =
		useImageStore();
	const { setCwd } = useTerminalStore();
	useEffect(() => {
		// Load the default Electro image on mount
		const loadImage = async (path: string) => {
			const fileUrl = IS_DEV_MODE ? path : convertFileSrc(path);
			const img = new Image();
			img.src = fileUrl;
			img.onload = () => setLoadedImage(img);
		};

		// Load the default image
		loadImage(IS_DEV_MODE ? DEV_DEFAULT_IMAGE_PATH : DEFAULT_IMAGE_PATH);

		// Start up the drag-drop listener
		listen("tauri://drag-drop", (event) => {
			const dragDropEvent = event as DragDropEvent;
			const filePath = normalizeFilePath(dragDropEvent.payload.paths[0]);

			const fileDirectory = filePath.split("/").slice(0, -1).join("/");
			loadSiblingImagePaths(fileDirectory);
			setCwd(fileDirectory);

			setDefaultSrc(filePath);
			loadImage(convertFileSrc(filePath));
		});

		// This listener is for when Electro is opened from the command line w/ an image path as the argument
		listen("image-source", (event: ImageSourceEvent) => {
			const filePath = normalizeFilePath(event.payload.source.value);
			if (!filePath) return;

			const fileDirectory = filePath.split("/").slice(0, -1).join("/");
			loadSiblingImagePaths(fileDirectory);

			setDefaultSrc(filePath);
			loadImage(convertFileSrc(filePath));
		}).then(() => {
			invoke("on_image_source_listener_ready");
		});
	}, [setDefaultSrc, setLoadedImage, setCwd, loadSiblingImagePaths]);

	return (
		<>
			<Terminal />
			<Canvas image={loadedImage} />
		</>
	);
}
