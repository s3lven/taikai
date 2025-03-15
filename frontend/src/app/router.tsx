import { Navigate, Route, Routes } from "react-router-dom"
import MainLayout from "../components/layout/main-layout"
import HomePage from "../pages/home-page"
import DashboardPage from "@/pages/dashboard-page"
import BracketPage from "@/pages/bracket-page"

export const AppRoutes = () => {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route index element={<HomePage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/bracket/:bracketId" element={<BracketPage />} />
      </Route>
      <Route path="*" element={<Navigate to={"/"} replace />} />
    </Routes>
  )
}
