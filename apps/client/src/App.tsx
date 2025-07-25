import { ConfigProvider } from 'antd'
import { Route, Routes } from 'react-router-dom'

import { AppLayout } from './components/Layout'
import { ProtectedRoute } from './components/ProtectedRoute'
import { ThemeProvider, useTheme } from './contexts/ThemeContext'
// Import pages
import Dashboard from './pages/Dashboard'
import { Login } from './pages/Login'
import NotFound from './pages/NotFound'
import Users from './pages/Users'

function AppContent() {
  const { themeConfig } = useTheme()

  return (
    <ConfigProvider theme={themeConfig}>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <AppLayout />
            </ProtectedRoute>
          }
        >
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="admin">
            <Route path="users" element={<Users />} />
          </Route>
          <Route index element={<Dashboard />} />
        </Route>
        <Route path="*" element={<NotFound />} />
      </Routes>
    </ConfigProvider>
  )
}

function App() {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  )
}

export default App
