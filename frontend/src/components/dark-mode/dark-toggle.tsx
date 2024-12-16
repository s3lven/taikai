import { useDarkModeStore } from "@/stores/dark-mode-store";

export const DarkModeToggle = () => {
	const { isDarkMode, toggleDarkMode } = useDarkModeStore();

	return (
		<button
			onClick={toggleDarkMode}
			className="p-2 bg-gray-200 dark:bg-gray-700 rounded-full transition-colors"
			aria-label={isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
		>
			{isDarkMode ? "🌞" : "🌙"}
		</button>
	);
};