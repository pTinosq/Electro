export interface ImageTransform {
	x: number; // Position on X-axis
	y: number; // Position on Y-axis
	width: number; // Scaled width
	height: number; // Scaled height
	offsetX: number; // Pan offset X
	offsetY: number; // Pan offset Y
}

export const DEFAULT_IMAGE_TRANSFORM: ImageTransform = {
	x: 0,
	y: 0,
	width: 0,
	height: 0,
	offsetX: 0,
	offsetY: 0,
};
