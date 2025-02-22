/// <reference types="vite/client" />

// Extend Vite's existing ImportMetaEnv instead of redeclaring built-in variables
interface ImportMetaEnv extends Readonly<Record<string, string | boolean | undefined>> {
  readonly VITE_API_URL?: string;
  readonly VITE_SOME_KEY?: string;
}

// Extend ImportMeta to include env
interface ImportMeta {
  readonly env: ImportMetaEnv;
}
