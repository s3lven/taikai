import { useRoutes } from "react-router-dom";
import MainLayout from "../components/layout/main-layout";
import HomePage from "../features/home/home-page";
import DashboardPage from "@/features/dashboard/dashboard-page";

export const AppRoutes = () => {
	const routes = [
		{
			element: <MainLayout />,
			children: [
				{ path: "/", element: <HomePage /> },
				{ path: "/dashboard", element: <DashboardPage /> },
			],
		},
	];

	const element = useRoutes([...routes]);
	return <>{element}</>;
};
