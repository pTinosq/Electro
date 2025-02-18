// Load an image from a URI and return a promise that resolves to the image element
export function loadImage(imageUri: string): Promise<HTMLImageElement> {
	return new Promise((resolve, reject) => {
		console.debug("771641", imageUri);
		const image = new Image();
		image.src = imageUri;
		image.onload = () => resolve(image);
		image.onerror = () =>
			reject(new Error(`Failed to load image from ${imageUri}`));
	});
}
