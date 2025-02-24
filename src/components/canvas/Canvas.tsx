import { useEffect, useRef, useState, useCallback } from "preact/hooks";
import { drawImageToCanvas, fitImageToCanvas } from "./canvasUtils";
import { DEFAULT_IMAGE_TRANSFORM, type ImageTransform } from "./ImageTransform";

interface CanvasProps {
	image: HTMLImageElement | null;
}

export default function Canvas({ image }: CanvasProps) {
	const canvasRef = useRef<HTMLCanvasElement>(null);
	const ZOOM_SENSITIVITY = 0.001;

	const [_transform, setTransform] = useState<ImageTransform>(
		DEFAULT_IMAGE_TRANSFORM,
	);
	const [isDragging, setIsDragging] = useState(false);
	const lastMousePos = useRef({ x: 0, y: 0 });

	// Runs once when image changes (initial setup)
	useEffect(() => {
		const canvas = canvasRef.current;
		if (!image || !canvas) return;

		const context = canvas.getContext("2d");
		if (!context) throw new Error("Failed to get canvas rendering context");

		// Set canvas size to current window dimensions
		canvas.width = window.innerWidth;
		canvas.height = window.innerHeight;

		// Fit the image and set initial transform state
		const initialTransform = fitImageToCanvas(canvas, image);

		// Dynamically adjust zoom limits based on image size
		const minSize = Math.min(image.width, image.height, 10);
		const maxSize = Math.max(image.width * 50, image.height * 50);

		setTransform({
			...initialTransform,
			minWidth: minSize,
			minHeight: minSize,
			maxWidth: maxSize,
			maxHeight: maxSize,
		});

		// Draw the image with the initial transform
		drawImageToCanvas(canvas, image, initialTransform);
	}, [image]);

	// Redraw on window resize while preserving current transform
	useEffect(() => {
		function handleResize() {
			if (!canvasRef.current || !image) return;
			const canvas = canvasRef.current;
			canvas.width = window.innerWidth;
			canvas.height = window.innerHeight;

			// Redraw using the existing transform so the image isn’t stretched
			setTransform((prev) => {
				const newTransform = { ...prev };
				drawImageToCanvas(canvas, image, newTransform);
				return newTransform;
			});
		}

		window.addEventListener("resize", handleResize);
		return () => {
			window.removeEventListener("resize", handleResize);
		};
	}, [image]);

	// Handle mouse down
	const onMouseDown = useCallback(
		(event: MouseEvent) => {
			switch (event.button) {
				case 0:
					setIsDragging(true);
					lastMousePos.current = { x: event.clientX, y: event.clientY };
					break;
				case 1: {
					// Reset transform on middle-click
					event.preventDefault();
					const canvas = canvasRef.current;
					if (!canvas || !image) return;

					const context = canvas.getContext("2d");
					if (!context)
						throw new Error("Failed to get canvas rendering context");

					// Set canvas size
					canvas.width = window.innerWidth;
					canvas.height = window.innerHeight;

					// Fit the image again
					const initialTransform = fitImageToCanvas(canvas, image);

					// Update transform limits
					const minSize = Math.min(image.width, image.height, 10);
					const maxSize = Math.max(image.width * 50, image.height * 50);

					setTransform({
						...initialTransform,
						minWidth: minSize,
						minHeight: minSize,
						maxWidth: maxSize,
						maxHeight: maxSize,
					});

					drawImageToCanvas(canvas, image, initialTransform);

					break;
				}
			}
		},
		[image],
	);

	// Handle mouse move (panning)
	const onMouseMove = useCallback(
		(event: MouseEvent) => {
			if (!isDragging || !canvasRef.current || !image) return;

			const dx = event.clientX - lastMousePos.current.x;
			const dy = event.clientY - lastMousePos.current.y;
			lastMousePos.current = { x: event.clientX, y: event.clientY };

			setTransform((prev) => {
				const newTransform = { ...prev, x: prev.x + dx, y: prev.y + dy };
				if (!canvasRef.current) return newTransform;
				drawImageToCanvas(canvasRef.current, image, newTransform);
				return newTransform;
			});
		},
		[isDragging, image],
	);

	const onMouseUp = useCallback(() => setIsDragging(false), []);

	// Handle zoom on scroll
	const onWheel = useCallback(
		(event: WheelEvent) => {
			if (!canvasRef.current || !image) return;
			event.preventDefault();

			const delta = -event.deltaY * ZOOM_SENSITIVITY;
			const zoomFactor = Math.exp(delta);

			const rect = canvasRef.current.getBoundingClientRect();
			const mouseX = event.clientX - rect.left;
			const mouseY = event.clientY - rect.top;

			setTransform((prev) => {
				const newWidth = prev.width * zoomFactor;
				const newHeight = prev.height * zoomFactor;

				if (
					newWidth < (prev.minWidth ?? 0) ||
					newWidth > (prev.maxWidth ?? Number.POSITIVE_INFINITY)
				) {
					return prev; // Don’t zoom beyond min/max
				}

				const newX = mouseX - ((mouseX - prev.x) * newWidth) / prev.width;
				const newY = mouseY - ((mouseY - prev.y) * newHeight) / prev.height;

				const newTransform = {
					...prev,
					x: newX,
					y: newY,
					width: newWidth,
					height: newHeight,
				};
				if (!canvasRef.current) return newTransform;
				drawImageToCanvas(canvasRef.current, image, newTransform);
				return newTransform;
			});
		},
		[image],
	);

	// Attach event listeners for mouse and wheel
	useEffect(() => {
		window.addEventListener("mousemove", onMouseMove);
		window.addEventListener("mouseup", onMouseUp);
		window.addEventListener("wheel", onWheel, { passive: false });

		return () => {
			window.removeEventListener("mousemove", onMouseMove);
			window.removeEventListener("mouseup", onMouseUp);
			window.removeEventListener("wheel", onWheel);
		};
	}, [onMouseMove, onMouseUp, onWheel]);

	return <canvas ref={canvasRef} id="canvas" onMouseDown={onMouseDown} />;
}
