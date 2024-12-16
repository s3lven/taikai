import React from "react";
import { Outlet } from "react-router-dom";

const MainLayout = () => {
	return (
		<div className="bg-red-500">
			MainLayout
			<Outlet />
		</div>
	);
};

export default MainLayout;
