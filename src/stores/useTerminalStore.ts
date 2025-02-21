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
	cwd: string;

	// Methods
	addHistory: (entry: TerminalHistoryEntry) => void;
	setIsTerminalOpen: (isOpen: boolean) => void;
	clearHistory: () => void;
	setCwd: (cwd: string) => void;
}

export const useTerminalStore = create<TerminalState>((set) => ({
	history: [],
	isTerminalOpen: false,
	cwd: "/",
	addHistory: (entry) =>
		set((state) => ({ history: [...state.history, entry] })),
	setIsTerminalOpen: (isOpen) =>
		set({
			isTerminalOpen: isOpen,
		}),
	clearHistory: () => set(() => ({ history: [] })),
	setCwd: (cwd) => set({ cwd }),
}));
