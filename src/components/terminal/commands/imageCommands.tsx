import CLICommand from "../../../commands/CLICommand";
import { useTerminalStore } from "../../../stores/useTerminalStore";
import { convertFileSrc } from "@tauri-apps/api/core";
import { useImageStore } from "../../../stores/useImageStore";
import CLICommandCategory from "../../../commands/CLICommandCategory";
import { normalizeFilePath } from "../../../utils/normalizeFilePaths";

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

				// Normalize the file path
				let normalizedFilePath: string;
				if (isRemote) {
					normalizedFilePath = filePath;
				} else {
					normalizedFilePath = normalizeFilePath(filePath);
				}

				const image = new Image();

				if (isRemote) {
					image.src = normalizedFilePath;
				} else {
					image.src = convertFileSrc(normalizedFilePath);
				}

				image.onload = async () => {
					useImageStore.getState().setDefaultSrc(normalizedFilePath);

					useTerminalStore.getState().addHistory({
						type: "output",
						value: `Image loaded from '${normalizedFilePath}'`,
						variant: "success",
					});
					useImageStore.getState().setLoadedImage(image);
					if (!isRemote) {
						// Set the current working directory to the directory of the loaded file
						const cwd = normalizedFilePath.split("/").slice(0, -1).join("/");

						useImageStore.getState().loadSiblingImagePaths(cwd);

						useTerminalStore
							.getState()
							.setCwd(normalizedFilePath.split("/").slice(0, -1).join("/"));
					}
				};

				image.onerror = () => {
					useTerminalStore.getState().addHistory({
						type: "output",
						value: `Error loading image from '${normalizedFilePath}'`,
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
