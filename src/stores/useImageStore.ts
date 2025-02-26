import { create } from "zustand";
import { readDir } from '@tauri-apps/plugin-fs';
import { CircularFileList } from "../utils/CircularFileList";
import { SUPPORTED_FILE_EXTENSIONS } from "../main";

interface ImageState {
	loadedImage: HTMLImageElement | null;
	defaultSrc: string | null;
	siblingImagePaths: CircularFileList;

	setLoadedImage: (image: HTMLImageElement) => void;
	setDefaultSrc: (src: string) => void;
	loadSiblingImagePaths: (path: string) => void;
}

export const useImageStore = create<ImageState>((set) => ({
	loadedImage: null,
	defaultSrc: null,
	siblingImagePaths: new CircularFileList(),

	setLoadedImage: (image: HTMLImageElement) => set({ loadedImage: image }),
	setDefaultSrc: (src: string) => set({ defaultSrc: src }),
	loadSiblingImagePaths: (imageDirectory: string) => {
		const directoryContents = readDir(imageDirectory);
		// Construct circular doubly linked list (CDLL) of image paths
		const CDLL = new CircularFileList();
		directoryContents.then((paths) => {
			paths
				// Only show files
				.filter((path) => path.isFile)
				// Only show files with supported file extensions
				.filter((path) => SUPPORTED_FILE_EXTENSIONS.includes((path.name.split('.').pop() || '')))
				// Push the file paths to the CDLL
				.map((path) => CDLL.push(`${imageDirectory}/${path.name}`))

			set({ siblingImagePaths: CDLL });
		});
	}
}));
