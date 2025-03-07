import { useEffect } from "preact/hooks";
import Canvas from "./components/canvas/Canvas";
import { listen } from "@tauri-apps/api/event";
import { useImageStore } from "./stores/useImageStore";
import { convertFileSrc, invoke } from "@tauri-apps/api/core";
import "./styles/normalize.css";
import "./styles/global.css";
import Terminal from "./components/terminal/Terminal";
import { useTerminalStore } from "./stores/useTerminalStore";
import { resolveResource } from "@tauri-apps/api/path";
import { normalizeFilePath } from "./utils/pathUtils";
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
	payload: {
		source: {
			value: string | null;
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
			normalizeFilePath(dragDropEvent.payload.paths[0])
				.then((filePath) => {
					const fileDirectory = filePath.split("/").slice(0, -1).join("/");
					loadSiblingImagePaths(fileDirectory);
					setCwd(fileDirectory);

					setDefaultSrc(filePath);
					loadImage(convertFileSrc(filePath));
				})
				.catch((err) => {
					console.error("Error loading drag-dropped image:", err);

					try {
						console.error("Payload:", JSON.stringify(event.payload, null, 2));
					} catch (jsonErr) {
						console.error("Failed to stringify payload", event.payload);
					}
				});
		});

		// This listener is for when Electro is opened from the command line w/ an image path as the argument
		listen("image-source", (event: ImageSourceEvent) => {
			if (!event.payload.source.value) {
				return;
			}
			normalizeFilePath(event.payload.source.value)
				.then((filePath) => {
					if (!filePath) {
						throw new Error("Invalid file path provided");
					}
					const fileDirectory = filePath.split("/").slice(0, -1).join("/");
					loadSiblingImagePaths(fileDirectory);
					setCwd(fileDirectory);

					setDefaultSrc(filePath);
					loadImage(convertFileSrc(filePath));
				})
				.catch((err) => {
					console.error("Error loading image source:", err);

					try {
						console.error("Payload:", JSON.stringify(event.payload, null, 2));
					} catch (jsonErr) {
						console.error("Failed to stringify payload", event.payload);
					}
				});
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
