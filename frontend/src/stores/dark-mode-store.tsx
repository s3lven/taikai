import { create } from "zustand";
import { persist } from "zustand/middleware";

// Store not big enough to warrant splitting State and Actions
interface DarkModeState {
	isDarkMode: boolean;
	toggleDarkMode: () => void;
}

export const useDarkModeStore = create<DarkModeState>()(
	persist(
		(set) => ({
			isDarkMode: false,
			toggleDarkMode: () => set((state) => ({ isDarkMode: !state.isDarkMode })),
		}),
		{
			name: "dark-mode-storage", // Gets stored in local storage by default
		}
	)
);