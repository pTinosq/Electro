import CLICommand from "../../../commands/CLICommand";
import { useTerminalStore } from "../../../stores/useTerminalStore";
import { convertFileSrc } from "@tauri-apps/api/core";
import { useImageStore } from "../../../stores/useImageStore";


export const imageCommands = [
  new CLICommand(
    "Load Image",
    "Loads an image from the specified file path",
    "load",
    async (_isAllowed, filePath) => {
      if (!filePath || filePath.trim() === "") {
        useTerminalStore.getState().addHistory("Error: No file path provided");
        return;
      }

      try {
        // Determine if the path is a URL or local file
        const isRemote = filePath.startsWith("http://") || filePath.startsWith("https://");
        const image = new Image();

        if (isRemote) {
          // TODO: Set default src to $USER
          useImageStore.getState().setDefaultSrc("C:");
          image.src = filePath;
        } else {
          useImageStore.getState().setDefaultSrc(filePath);
          image.src = convertFileSrc(filePath);
        }

        image.onload = () => {
          useTerminalStore.getState().addHistory(`Image loaded from ${filePath}`);
          useImageStore.getState().setLoadedImage(image);

        };
      } catch (error) {
        if (error instanceof Error) {
          useTerminalStore.getState().addHistory(`Error loading image: ${error.message}`);
          console.error("Error loading image:", error);
        } else {
          useTerminalStore.getState().addHistory("Error loading image: Unknown error");
          console.error("Error loading image: Unknown error", error);
        }
      }
    },
    () => true
  )
];
