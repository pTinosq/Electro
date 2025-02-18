import CLICommand from "../CLICommand";
import { loadImage } from "../../../utils/imageLoader";
import { TransformBuilder } from "../../Canvas/TransformBuilder";
import { CanvasController } from "../../../canvas/canvasController";
import { DEFAULT_IMAGE_TRANSFORM } from "../../Canvas/ImageTransform";

export const imageCommands = [
  new CLICommand(
    "Load Image",
    "Loads an image from the specified file path",
    "load",
    async (terminal, _isAllowed, filePath) => {
      if (!filePath || filePath.trim() === "") {
        terminal.appendToHistory("Error: No file path specified.");
        return;
      }

      try {
        terminal.appendToHistory(`Loading image from ${filePath}...`);
        // Determine if the path is a URL or local file
        const isRemote = filePath.startsWith("http://") || filePath.startsWith("https://");
        // const resolvedPath = isRemote ? filePath : convertFileSrc(filePath);

        // const image = await loadImage(resolvedPath);
        let image: HTMLImageElement;

        if (isRemote) {
          image = await loadImage(filePath, false);
        } else {
          image = await loadImage(filePath, true);
        }

        const canvasController = CanvasController.getInstance();

        const transform = new TransformBuilder(DEFAULT_IMAGE_TRANSFORM)
          .scaleToFit(canvasController.canvas, image)
          .center(canvasController.canvas)
          .build();

        canvasController.setImage(image, transform);
        terminal.appendToHistory("Image loaded successfully.");
      } catch (error) {
        if (error instanceof Error) {
          terminal.appendToHistory(`Error loading image: ${error.message}`);
          console.error("Error loading image:", error);
        } else {
          terminal.appendToHistory("Error loading image: Unknown error");
          console.error("Error loading image: Unknown error", error);
        }
      }
    },
    () => true
  )
];
