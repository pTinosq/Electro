import { create } from "zustand";

interface ImageState {
  loadedImage: HTMLImageElement | null;
  defaultSrc: string | null;

  setLoadedImage: (image: HTMLImageElement) => void;
  setDefaultSrc: (src: string) => void;
}

export const useImageStore = create<ImageState>((set) => ({
  loadedImage: null,
  defaultSrc: null,

  setLoadedImage: (image: HTMLImageElement) => set({ loadedImage: image }),
  setDefaultSrc: (src: string) => set({ defaultSrc: src }),
}));
