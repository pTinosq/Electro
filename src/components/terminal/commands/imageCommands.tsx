import CLICommand from "../../../commands/CLICommand";
import { useTerminalStore } from "../../../stores/useTerminalStore";
import { convertFileSrc } from "@tauri-apps/api/core";
import { useImageStore } from "../../../stores/useImageStore";
import CLICommandCategory from "../../../commands/CLICommandCategory";
import { normalizeFilePath, resolvePath } from "../../../utils/pathUtils";
import { homeDir, isAbsolute } from "@tauri-apps/api/path"; // For user home directory

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

			const imageStore = useImageStore.getState();
			const terminalStore = useTerminalStore.getState();

			try {
				// Check if the path is remote (URL)
				const isRemote =
					filePath.startsWith("http://") || filePath.startsWith("https://");

				let resolvedFilePath: string;

				if (isRemote) {
					resolvedFilePath = filePath;
				} else {
					const cwd = terminalStore.cwd;
					const absolute = await isAbsolute(filePath);

					resolvedFilePath = absolute
						? await normalizeFilePath(filePath)
						: await resolvePath(cwd, filePath); // Resolve relative paths
				}

				// Create the image element and set the source
				const image = new Image();
				image.src = isRemote
					? resolvedFilePath
					: convertFileSrc(resolvedFilePath);

				image.onload = async () => {
					if (!isRemote) {
						const fileDirectory = resolvedFilePath
							.split("/")
							.slice(0, -1)
							.join("/");
						imageStore.loadSiblingImagePaths(fileDirectory);
						terminalStore.setCwd(fileDirectory);
					} else {
						// Set CWD to user's home directory for remote images
						terminalStore.setCwd(await homeDir());
					}

					imageStore.setDefaultSrc(resolvedFilePath);

					terminalStore.addHistory({
						type: "output",
						value: `Image loaded from '${resolvedFilePath}'`,
						variant: "success",
					});
					imageStore.setLoadedImage(image);
				};

				image.onerror = () => {
					terminalStore.addHistory({
						type: "output",
						value: `Error loading image from '${resolvedFilePath}'`,
						variant: "error",
					});
				};
			} catch (error) {
				terminalStore.addHistory({
					type: "output",
					value: `Error loading image: ${error instanceof Error ? error.message : "Unknown error"}`,
					variant: "error",
				});
				console.error("Error loading image:", error);
			}
		},
		() => true,
	),
];

export const imageCommandsCategory = new CLICommandCategory(
	"Image",
	imageCommands,
);
