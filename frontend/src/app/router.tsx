import { Navigate, Outlet, Route, Routes } from "react-router-dom"
import MainLayout from "../components/layout/main-layout"
import HomePage from "../pages/home-page"
import DashboardPage from "@/pages/dashboard-page"
import BracketPage from "@/pages/bracket-page"
import LoginPage from "@/pages/login-page"
import ProfilePage from "@/pages/profile-page"
import useAuth from "@/hooks/useAuth"

const ProtectedRoute = () => {
  const { session, loading } = useAuth()

  if (loading) {
    return null // Or return a loading spinner component
  }

  if (!session) {
    return <Navigate to={"login"} replace />
  }

  return <Outlet />
}

export const AppRoutes = () => {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route index element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />

        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/bracket/:bracketId" element={<BracketPage />} />
          <Route path="/profile" element={<ProfilePage />} />
        </Route>
      </Route>
      <Route path="*" element={<Navigate to={"/"} replace />} />
    </Routes>
  )
}
