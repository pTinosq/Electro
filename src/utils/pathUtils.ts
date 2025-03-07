import { normalize, resolve } from "@tauri-apps/api/path";

/**
 * Normalizes a given file path to use forward slashes (`/`).
 * Handles Windows-style (`C:\\path\\to\\file`) and Unix-style (`/path/to/file`).
 */
export async function normalizeFilePath(filePath: string): Promise<string> {
	const normalizedPath = await normalize(filePath);
	return normalizedPath.replace(/\\/g, "/");
}

/**
 * Resolves a relative path against a base directory.
 * Ensures compatibility across Windows, macOS, and Linux.
 */
export async function resolvePath(baseDir: string, relativePath: string): Promise<string> {
	const resolvedPath = resolve(baseDir, relativePath).then(normalizeFilePath);

	return resolvedPath;
}