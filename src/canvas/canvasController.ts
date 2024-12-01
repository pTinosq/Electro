import { TransformBuilder } from "./TransformBuilder";
import {
	DEFAULT_IMAGE_TRANSFORM,
	type ImageTransform,
} from "../types/ImageTransform";
import { drawImageToCanvas } from "./canvasUtils";
export class CanvasController {
	// Constants
	public ZOOM_SENSITIVITY = 0.001;
	public MIN_WIDTH = 100;
	public MAX_WIDTH = 50000;

	// Properties
	private canvas: HTMLCanvasElement;
	private currentTransform: ImageTransform;
	private currentImage: HTMLImageElement | undefined;

	// State
	private isDragging = false;
	private lastMouseX = 0;
	private lastMouseY = 0;

	constructor(canvas: HTMLCanvasElement) {
		this.canvas = canvas;
		this.currentTransform = { ...DEFAULT_IMAGE_TRANSFORM };
		this.addListeners();
	}

	// Method to update the image and transform
	public setImage(image: HTMLImageElement, transform: ImageTransform): void {
		this.currentImage = image;
		this.currentTransform = transform;

		// Update MAX_WIDTH based on the new image
		this.MAX_WIDTH = Math.max(image.width, image.height) * 100;

		this.redraw();
	}

	private addListeners(): void {
		this.canvas.addEventListener("mousedown", this.onMouseDown.bind(this));
		this.canvas.addEventListener("mousemove", this.onMouseMove.bind(this));
		this.canvas.addEventListener("mouseup", this.onMouseUp.bind(this));
		this.canvas.addEventListener("mouseleave", this.onMouseUp.bind(this));
		this.canvas.addEventListener("wheel", this.onWheel.bind(this));
	}

	private onMouseDown(event: MouseEvent): void {
		switch (event.button) {
			case 0:
				this.onLeftMouseDown(event);
				break;
			case 1:
				this.onMiddleMouseDown(event);
				break;
		}
	}

	private onMouseMove(event: MouseEvent): void {
		if (!this.isDragging) {
			return;
		}

		// Get current mouse position relative to the canvas
		const rect = this.canvas.getBoundingClientRect();
		const mouseX = event.clientX - rect.left;
		const mouseY = event.clientY - rect.top;

		const dx = mouseX - this.lastMouseX;
		const dy = mouseY - this.lastMouseY;
		this.currentTransform.x += dx;
		this.currentTransform.y += dy;

		// Update last mouse positions for the next move event
		this.lastMouseX = mouseX;
		this.lastMouseY = mouseY;

		this.redraw();
	}

	private onMouseUp(event: MouseEvent): void {
		if (event.button === 0) {
			this.isDragging = false;
		}
	}

	private onWheel(event: WheelEvent): void {
		event.preventDefault();

		const delta = -event.deltaY * this.ZOOM_SENSITIVITY;
		const zoomFactor = Math.exp(delta);

		// Get mouse position relative to the canvas
		const rect = this.canvas.getBoundingClientRect();
		const mouseX = event.clientX - rect.left;
		const mouseY = event.clientY - rect.top;

		// Calculate mouse position relative to the image
		const imageMouseX =
			(mouseX - this.currentTransform.x) / this.currentTransform.width;
		const imageMouseY =
			(mouseY - this.currentTransform.y) / this.currentTransform.height;

		const newWidth = this.currentTransform.width * zoomFactor;
		const newHeight = this.currentTransform.height * zoomFactor;

		// Check if the new width is within allowed limits
		if (newWidth < this.MIN_WIDTH || newWidth > this.MAX_WIDTH) {
			return;
		}

		// Update x and y to keep the image centered on the mouse position
		this.currentTransform.x = mouseX - imageMouseX * newWidth;
		this.currentTransform.y = mouseY - imageMouseY * newHeight;

		this.currentTransform.width = newWidth;
		this.currentTransform.height = newHeight;

		this.redraw();
	}

	private onMiddleMouseDown(_event: MouseEvent): void {
		// Reset the transform to the initial state
		if (this.currentImage) {
			this.currentTransform = new TransformBuilder(DEFAULT_IMAGE_TRANSFORM)
				.scaleToFit(this.canvas, this.currentImage)
				.center(this.canvas)
				.build();
		}

		this.redraw();
	}

	private onLeftMouseDown(event: MouseEvent): void {
		this.isDragging = true;

		// Get mouse position relative to the canvas
		const rect = this.canvas.getBoundingClientRect();
		this.lastMouseX = event.clientX - rect.left;
		this.lastMouseY = event.clientY - rect.top;
	}

	private redraw(): void {
		if (this.currentImage) {
			drawImageToCanvas(this.canvas, this.currentImage, this.currentTransform);
		}
	}

	public start(): void {}
}
