import type { ImageTransform } from "./ImageTransform";

export function drawImageToCanvas(
	canvas: HTMLCanvasElement,
	image: HTMLImageElement,
	transform: ImageTransform,
) {
	const context = canvas.getContext("2d");
	if (!context) throw new Error("Failed to get canvas rendering context");

	context.imageSmoothingEnabled = false;
	context.clearRect(0, 0, canvas.width, canvas.height);

	context.resetTransform();
	context.translate(transform.offsetX, transform.offsetY);

	// Draw the image using the transformed position and size
	context.drawImage(
		image,
		transform.x,
		transform.y,
		transform.width,
		transform.height,
	);
}

export function fitImageToCanvas(
	canvas: HTMLCanvasElement,
	image: HTMLImageElement,
): ImageTransform {
	// Calculate scaling factors
	const widthScale = canvas.width / image.width;
	const heightScale = canvas.height / image.height;

	// Choose the smaller scale to maintain aspect ratio
	const scale = Math.min(widthScale, heightScale, 1);

	const width = image.width * scale;
	const height = image.height * scale;

	// Center the image on the canvas
	const x = (canvas.width - width) / 2;
	const y = (canvas.height - height) / 2;

	return {
		x,
		y,
		width,
		height,
		offsetX: 0,
		offsetY: 0,
	};
}
