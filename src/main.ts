import { initializeImageSourceListener } from "./listeners/imageSourceListener";
import { loadImage } from "./image/imageLoader";
import { TransformBuilder } from "./canvas/TransformBuilder";
import {
	DEFAULT_IMAGE_TRANSFORM,
	type ImageTransform,
} from "./types/ImageTransform";
import { CanvasController } from "./canvas/canvasController";
import { initializeDragDropListener } from "./listeners/dragDropListener";
import KeybindListener from "./keybinds/KeybindListener";
import KeybindProcessor from "./keybinds/KeybindProcessor";
import { loadAllCommands } from "./commands/loadCommands";

const canvas = document.getElementById("canvas") as HTMLCanvasElement;
const canvasController = new CanvasController(canvas);

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let currentImage: HTMLImageElement | null = null;
let currentTransform: ImageTransform = DEFAULT_IMAGE_TRANSFORM;

// Handle window resizing
window.addEventListener("resize", () => {
	canvas.width = window.innerWidth;
	canvas.height = window.innerHeight;

	if (currentImage) {
		currentTransform = new TransformBuilder(DEFAULT_IMAGE_TRANSFORM)
			.scaleToFit(canvas, currentImage)
			.center(canvas)
			.build();

		canvasController.setImage(currentImage, currentTransform);
	}
});

// Handle image source
initializeImageSourceListener(async (imageUri) => {
	try {
		const defaultImage = "/src/assets/electro-default.jpg";
		const image = await loadImage(imageUri || defaultImage);

		currentImage = image;
		currentTransform = new TransformBuilder(DEFAULT_IMAGE_TRANSFORM)
			.scaleToFit(canvas, image)
			.center(canvas)
			.build();

		// Use setImage instead of creating a new controller
		canvasController.setImage(image, currentTransform);
	} catch (error) {
		console.error("Error loading image:", error);
	}
});

// Handle drag and drop
initializeDragDropListener(async (imageUri: string) => {
	try {
		const image = await loadImage(imageUri);

		currentImage = image;
		currentTransform = new TransformBuilder(DEFAULT_IMAGE_TRANSFORM)
			.scaleToFit(canvas, image)
			.center(canvas)
			.build();

		canvasController.setImage(image, currentTransform);
	} catch (error) {
		console.error("Error loading image:", error);
	}
});

// Initialize the KeybindProcessor
const keybindProcessor = new KeybindProcessor();

// Initialize the KeybindListener with the processor
const keybindListener = new KeybindListener(keybindProcessor);

// Load the keybinds into state
console.log("Loading keybinds...");
loadAllCommands();

keybindListener.start();

canvasController.start();
