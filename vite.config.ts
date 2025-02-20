import { defineConfig } from "vite";
import preact from "@preact/preset-vite";

// @ts-expect-error process is a Node.js global
const host = process.env.TAURI_DEV_HOST;

export default defineConfig(async () => ({
  plugins: [preact()],
  clearScreen: false,
  server: {
    port: 1420,
    strictPort: true,
    host: host || false,
    hmr: host
      ? {
          protocol: "ws",
          host,
          port: 1421,
        }
      : undefined,
    watch: {
      ignored: ["**/src-tauri/**"],
    },
  },
}));
