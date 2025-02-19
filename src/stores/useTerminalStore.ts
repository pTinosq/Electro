import { create } from "zustand";

interface TerminalState {
  history: string[];
  addHistory: (line: string) => void;
}

export const useTerminalStore = create<TerminalState>((set) => ({
  history: [],
  addHistory: (line) => set((state) => ({ history: [...state.history, line] })),
}));
