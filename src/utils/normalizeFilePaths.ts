/**
 * Normalizes a given file path to use forward slashes (`/`).
 * Handles Windows-style (`C:\\path\\to\\file`) and Unix-style (`/path/to/file`).
 */
export function normalizeFilePath(filePath: string): string {
	return filePath.replace(/\\/g, "/");
}
