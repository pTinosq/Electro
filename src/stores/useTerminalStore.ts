import { invoke } from "@tauri-apps/api/core";
import { create } from "zustand";

export interface TerminalHistoryEntry {
	type: "input" | "output";
	value: string;
	variant?: "default" | "error" | "warn" | "success";
}

interface TerminalState {
	// Variables
	history: TerminalHistoryEntry[];
	isTerminalOpen: boolean;
	isTerminalInputFocused: boolean;
	cwd: string;

	// Methods
	addHistory: (entry: TerminalHistoryEntry) => void;
	setIsTerminalOpen: (isOpen: boolean) => void;
	setIsTerminalInputFocused: (isFocused: boolean) => void;
	clearHistory: () => void;
	setCwd: (cwd: string) => void;
}

export const useTerminalStore = create<TerminalState>((set) => ({
	history: [],
	isTerminalOpen: false,
	isTerminalInputFocused: false,
	cwd: "/",

	addHistory: (entry) =>
		set((state) => ({ history: [...state.history, entry] })),
	setIsTerminalOpen: (isOpen) => set({ isTerminalOpen: isOpen }),
	setIsTerminalInputFocused: (isFocused: boolean) =>
		set({ isTerminalInputFocused: isFocused }),
	clearHistory: () => set(() => ({ history: [] })),
	setCwd: async (cwd) => {
		await invoke("change_cwd", { path: cwd });
		set({ cwd });
	},
}));
