import { Outlet } from "react-router-dom";
import { useDarkModeStore } from "@/stores/dark-mode-store";

const MainLayout = () => {
	const { isDarkMode } = useDarkModeStore();

	return (
		<div className={isDarkMode ? "dark" : ""}>
			<div className={`w-full h-full flex transition-colors duration-300`}>
				{/* Navbar Here */}
				<Outlet />
			</div>
		</div>
	);
};

export default MainLayout;
