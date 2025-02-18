import { useEffect, useState } from "preact/hooks";
import Canvas from "./components/Canvas/Canvas";

const DEFAULT_IMAGE = "/src/assets/electro-default.jpg";

export default function App() {
  const [image, setImage] = useState<HTMLImageElement | null>(null);

  useEffect(() => {
    // Load default image on mount
    const img = new Image();
    img.src = DEFAULT_IMAGE;
    img.onload = () => setImage(img);
  }, []);

  return <Canvas image={image} />;
}
