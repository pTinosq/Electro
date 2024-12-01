import type { ImageTransform } from "../types/ImageTransform";

export class TransformBuilder {
	private transform: ImageTransform;

	constructor(initialTransform: ImageTransform) {
		this.transform = initialTransform;
	}

	// Scale the image to fit within the canvas
	scaleToFit(canvas: HTMLCanvasElement, image: HTMLImageElement): this {
		const widthScale = canvas.width / image.width;
		const heightScale = canvas.height / image.height;
		const scale = Math.min(widthScale, heightScale, 1);

		this.transform.width = image.width * scale;
		this.transform.height = image.height * scale;
		return this;
	}

	// Center the image within the canvas
	center(canvas: HTMLCanvasElement): this {
		this.transform.x = (canvas.width - this.transform.width) / 2;
		this.transform.y = (canvas.height - this.transform.height) / 2;
		return this;
	}

	offset(dx: number, dy: number): this {
		this.transform.offsetX += dx;
		this.transform.offsetY += dy;
		return this;
	}

	build(): ImageTransform {
		return this.transform;
	}
}
