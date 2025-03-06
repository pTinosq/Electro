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
import { resolveResource } from "@tauri-apps/api/path";
const DEV_DEFAULT_IMAGE_PATH = "/src/assets/electro-default.jpg";
const DEFAULT_IMAGE_PATH = "assets/electro-default.jpg";
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
	payload:
		| {
				source: {
					value: string;
				};
		  }
		| string[];
}

export default function App() {
	const { loadedImage, setLoadedImage, setDefaultSrc, loadSiblingImagePaths } =
		useImageStore();
	const { setCwd } = useTerminalStore();
	useEffect(() => {
		// Load the default Electro image on mount
		const loadImage = async (path: string) => {
			const img = new Image();
			img.src = path;
			img.onload = () => {
				setLoadedImage(img);
			};
		};

		// Load the default image
		if (IS_DEV_MODE) {
			loadImage(DEV_DEFAULT_IMAGE_PATH);
		} else {
			resolveResource(DEFAULT_IMAGE_PATH).then((path) => {
				loadImage(convertFileSrc(path));
			});
		}

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
			let filePath: string;
			if (Array.isArray(event.payload)) {
				const payload = event.payload;
				if (payload.length === 0) return;
				filePath = normalizeFilePath(event.payload[0]);
			} else {
				filePath = normalizeFilePath(event.payload.source.value);
			}
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
