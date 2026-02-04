import { BrowserRouter, Routes, Route } from "react-router-dom"
import { AuthLayout } from "./layouts/AuthLayout"
import { ProtectedLayout } from "./layouts/ProtectedLayout"
import { LoginForm } from "./features/auth/components/LoginForm"
import { RegisterForm } from "./features/auth/components/RegisterForm"
import { Toaster } from "@/components/ui/sonner"
import BoardPage from "./pages/BoardPage"
import DashboardPage from "./pages/DashboardPage"
import LeadsPage from "./pages/LeadsPage"
import SettingsPage from "./pages/SettingsPage"

import { ErrorBoundary } from "./components/ErrorBoundary"

import { useEffect } from "react"
import { useAuthStore } from "./store/useAuthStore"
import { useThemeStore } from "./store/useThemeStore"

function App() {
  const initializeListener = useAuthStore((state) => state.initializeListener)
  const { theme, setTheme } = useThemeStore()

  useEffect(() => {
    const unsubscribe = initializeListener()
    return () => unsubscribe()
  }, [initializeListener])

  // Initialize theme on mount
  useEffect(() => {
    setTheme(theme)
  }, [])

  return (
    <BrowserRouter>
      <ErrorBoundary>
        <Routes>
          {/* Public Routes */}
          <Route element={<AuthLayout />}>
            <Route path="/login" element={<LoginForm />} />
            <Route path="/register" element={<RegisterForm />} />
          </Route>

          {/* Protected Routes */}
          <Route element={<ProtectedLayout />}>
            <Route path="/" element={<DashboardPage />} />
            <Route path="/board" element={<BoardPage />} />
            <Route path="/leads" element={<LeadsPage />} />
            <Route path="/settings" element={<SettingsPage />} />
          </Route>
        </Routes>
      </ErrorBoundary>
      <Toaster />
    </BrowserRouter>
  )
}

export default App
