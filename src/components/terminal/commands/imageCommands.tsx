import CLICommand from "../../../commands/CLICommand";
import { useTerminalStore } from "../../../stores/useTerminalStore";
import { convertFileSrc } from "@tauri-apps/api/core";
import { useImageStore } from "../../../stores/useImageStore";
import CLICommandCategory from "../../../commands/CLICommandCategory";

export const imageCommands = [
	new CLICommand(
		"Load Image",
		"Loads an image from the specified file path. Usage: load <file path>",
		"load",
		async (_isAllowed, filePath) => {
			if (!filePath || filePath.trim() === "") {
				useTerminalStore.getState().addHistory({
					type: "output",
					value: "Usage: load <file path>",
					variant: "warn",
				});
				return;
			}

			try {
				// Determine if the path is a URL or local file
				const isRemote =
					filePath.startsWith("http://") || filePath.startsWith("https://");
				const image = new Image();

				if (isRemote) {
					image.src = filePath;
				} else {
					image.src = convertFileSrc(filePath);
				}

				image.onload = async () => {
					useImageStore.getState().setDefaultSrc(filePath);

					useTerminalStore.getState().addHistory({
						type: "output",
						value: `Image loaded from '${filePath}'`,
						variant: "success",
					});
					useImageStore.getState().setLoadedImage(image);
				};

				image.onerror = () => {
					useTerminalStore.getState().addHistory({
						type: "output",
						value: `Error loading image from '${filePath}'`,
						variant: "error",
					});
				};
			} catch (error) {
				if (error instanceof Error) {
					useTerminalStore.getState().addHistory({
						type: "output",
						value: `Error loading image: ${error.message}`,
						variant: "error",
					});
					console.error("Error loading image:", error);
				} else {
					useTerminalStore.getState().addHistory({
						type: "output",
						value: "Error loading image: Unknown error",
						variant: "error",
					});
					console.error("Error loading image: Unknown error", error);
				}
			}
		},
		() => true,
	),
];

export const imageCommandsCategory = new CLICommandCategory(
	"Image",
	imageCommands,
);
