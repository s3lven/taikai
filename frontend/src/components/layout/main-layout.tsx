import { Outlet } from "react-router-dom";
import { useDarkModeStore } from "@/stores/dark-mode-store";
import Navbar from "./nav-bar";

const MainLayout = () => {
	const { isDarkMode } = useDarkModeStore();

	return (
		<div className={isDarkMode ? "dark" : ""}>
			<div
				className={`w-screen min-h-screen flex flex-col transition-colors duration-300 font-poppins`}
			>
				<Navbar />
				{/* <div className="flex-1"> */}

					<Outlet />
				{/* </div> */}
			</div>
		</div>
	);
};

export default MainLayout;
