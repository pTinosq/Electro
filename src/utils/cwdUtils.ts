import { invoke } from "@tauri-apps/api/core";
import store from "../old.store";

export interface SetCwdResult {
  success: boolean;
  path?: string;
  error?: string;
}

export async function setCwd(path: string): Promise<SetCwdResult> {
  if (!path) {
    return { success: false, error: "Invalid path provided." };
  }

  try {
    const newPath = await invoke<string>("change_cwd", { path });
    store.dispatch({ type: "terminal/setCwd", payload: newPath });
    return { success: true, path: newPath };
  } catch (error) {
    return { success: false, error: `Error changing directory: ${error instanceof Error ? error.message : String(error)}` };
  }
}
