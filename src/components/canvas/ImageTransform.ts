export interface ImageTransform {
	x: number;
	y: number;
	width: number;
	height: number;
	offsetX: number;
	offsetY: number;
	minWidth?: number;
	minHeight?: number;
	maxWidth?: number;
	maxHeight?: number;
}

export const DEFAULT_IMAGE_TRANSFORM: ImageTransform = {
	x: 0,
	y: 0,
	width: 0,
	height: 0,
	offsetX: 0,
	offsetY: 0,
	minWidth: 0,
	minHeight: 0,
	maxWidth: 0,
	maxHeight: 0,
};
