import type { ImageTransform } from "../types/ImageTransform";

export function getCenteredTransform(
	canvas: HTMLCanvasElement,
	image: HTMLImageElement,
): ImageTransform {
	const x = (canvas.width - image.width) / 2;
	const y = (canvas.height - image.height) / 2;

	return {
		x,
		y,
		width: image.width,
		height: image.height,
		offsetX: 0,
		offsetY: 0,
	};
}
