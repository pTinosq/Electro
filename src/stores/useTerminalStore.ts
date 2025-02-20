import { create } from "zustand";

interface TerminalState {
  // Variables
  history: string[];
  isTerminalOpen: boolean;
  cwd: string;

  // Methods
  addHistory: (line: string) => void;
  setIsTerminalOpen: (isOpen: boolean) => void;
  clearHistory: () => void;
  setCwd: (cwd: string) => void;
}

export const useTerminalStore = create<TerminalState>((set) => ({
  history: [],
  isTerminalOpen: true,
  cwd: "/",
  addHistory: (line) => set((state) => ({ history: [...state.history, line] })),
  setIsTerminalOpen: (isOpen) => set({
    isTerminalOpen: isOpen
  }),
  clearHistory: () => set(() => ({ history: [] })),
  setCwd: (cwd) => set({ cwd })
}))