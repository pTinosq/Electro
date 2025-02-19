import { useEffect } from "preact/hooks";
import Canvas from "./components/Canvas/Canvas";
import { listen } from "@tauri-apps/api/event";
import { useImageStore } from "./stores/useImageStore";
import { convertFileSrc, invoke } from "@tauri-apps/api/core";

const DEFAULT_IMAGE = "/src/assets/electro-default.jpg";

interface DragDropEvent {
  payload: {
    paths: string[];
    position: {
      x: number;
      y: number;
    };
  };
}

interface ImageSourceEvent {
  payload: {
    source: {
      value: string;
    }
  };
}


export default function App() {
  const { loadedImage, setLoadedImage, setDefaultSrc } = useImageStore();

  // Load default image on mount
  useEffect(() => {
    const img = new Image();
    img.src = DEFAULT_IMAGE;
    img.onload = () => setLoadedImage(img);

    // Drag and drop listener
    listen("tauri://drag-drop", (event) => {
      const dragDropEvent = event as DragDropEvent;
      const filePath = dragDropEvent.payload.paths[0];
      setDefaultSrc(filePath);

      const fileUrl = convertFileSrc(filePath);

      const img = new Image();
      img.src = fileUrl;
      img.onload = () => setLoadedImage(img);
    });

    listen("image-source", (event: ImageSourceEvent) => {
      const filePath = event.payload.source.value;
      if (!filePath) return;

      setDefaultSrc(filePath);

      const fileUrl = convertFileSrc(filePath);

      const img = new Image();
      img.src = fileUrl;
      img.onload = () => setLoadedImage(img);
    }).then(() => {
      invoke("on_image_source_listener_ready");
    });

  }, [setDefaultSrc, setLoadedImage]);



  return <Canvas image={loadedImage} />;
}
