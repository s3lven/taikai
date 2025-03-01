import { useRoutes } from "react-router-dom";
import MainLayout from "../components/layout/main-layout";
import HomePage from "../features/home/home-page";
import DashboardPage from "@/pages/dashboard-page";
import BracketPage from "@/features/bracket/bracket-page";

export const AppRoutes = () => {
  const routes = [
    {
      element: <MainLayout />,
      children: [
        { path: "/", element: <HomePage /> },
        { path: "/dashboard", element: <DashboardPage /> },
        { path: "/bracket/:bracketId", element: <BracketPage /> },
      ],
    },
  ];

  const element = useRoutes([...routes]);
  return <>{element}</>;
};
