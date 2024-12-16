import { Outlet } from "react-router-dom";
import { useDarkModeStore } from "@/stores/dark-mode-store";
import Navbar from "./nav-bar";

const MainLayout = () => {
	const { isDarkMode } = useDarkModeStore();

	return (
		<div className={isDarkMode ? "dark" : ""}>
			<div className={`w-screen h-full transition-colors duration-300 font-poppins`}>
				<Navbar />
				<Outlet />
			</div>
		</div>
	);
};

export default MainLayout;
