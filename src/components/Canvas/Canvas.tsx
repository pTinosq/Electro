import { useEffect, useRef, useState, useCallback } from "preact/hooks";
import { drawImageToCanvas, fitImageToCanvas } from "./canvasUtils";
import type { ImageTransform } from "./ImageTransform";

interface CanvasProps {
  image: HTMLImageElement | null;
}

export default function Canvas({ image }: CanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const ZOOM_SENSITIVITY = 0.001;
  const MIN_WIDTH = 100;
  const MAX_WIDTH = 50000;

  const [_transform, setTransform] = useState<ImageTransform>({
    x: 0,
    y: 0,
    width: 0,
    height: 0,
    offsetX: 0,
    offsetY: 0,
  });

  const [isDragging, setIsDragging] = useState(false);
  const lastMousePos = useRef({ x: 0, y: 0 });

  // Runs once when image changes
  useEffect(() => {
    if (!image) return;
    const canvas = canvasRef.current;
    if (!canvas) return;

    const context = canvas.getContext("2d");
    if (!context) throw new Error("Failed to get canvas rendering context");

    // Set canvas size
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    // Fit the image and set initial transform state
    const initialTransform = fitImageToCanvas(canvas, image);
    setTransform(initialTransform);

    drawImageToCanvas(canvas, image, initialTransform);
  }, [image]);

  // Handles panning
  const onMouseDown = useCallback((event: MouseEvent) => {
    if (event.button !== 0) return; // Only left-click
    setIsDragging(true);
    lastMousePos.current = { x: event.clientX, y: event.clientY };
  }, []);


  const onMouseMove = useCallback((event: MouseEvent) => {
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
  }, [isDragging, image]);

  const onMouseUp = useCallback(() => setIsDragging(false), []);

  /** Handles zooming */
  const onWheel = useCallback((event: WheelEvent) => {
    if (!canvasRef.current || !image) return;
    event.preventDefault();

    const delta = -event.deltaY * ZOOM_SENSITIVITY;
    const zoomFactor = Math.exp(delta);

    // Get mouse position relative to the canvas
    const rect = canvasRef.current.getBoundingClientRect();
    const mouseX = event.clientX - rect.left;
    const mouseY = event.clientY - rect.top;

    setTransform((prev) => {
      const newWidth = prev.width * zoomFactor;
      const newHeight = prev.height * zoomFactor;

      // Check if the new width is within allowed limits
      if (newWidth < MIN_WIDTH || newWidth > MAX_WIDTH) return prev;

      const newX = mouseX - ((mouseX - prev.x) * newWidth) / prev.width;
      const newY = mouseY - ((mouseY - prev.y) * newHeight) / prev.height;

      const newTransform = { ...prev, x: newX, y: newY, width: newWidth, height: newHeight };
      if (!canvasRef.current) return newTransform;
      drawImageToCanvas(canvasRef.current, image, newTransform);
      return newTransform;
    });
  }, [image]);

  // Event listeners
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
