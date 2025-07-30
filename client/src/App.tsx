import { ConfigProvider } from 'antd'
import { Route, Routes } from 'react-router-dom'

import { ThemeProvider, useTheme } from './contexts/ThemeContext'
import { AdminDashboard } from './pages/AdminDashboard'
import { AdminLogin } from './pages/AdminLogin'
// Import pages
import { MainMenu } from './pages/MainMenu'
import NotFound from './pages/NotFound'
import { TestInterface } from './pages/TestInterface'
import { TestResults } from './pages/TestResults'

function AppContent() {
  const { themeConfig } = useTheme()

  return (
    <ConfigProvider theme={themeConfig}>
      <Routes>
        <Route path="/" element={<MainMenu />} />
        <Route path="/test" element={<TestInterface />} />
        <Route path="/results" element={<TestResults />} />
        <Route path="/admin" element={<AdminLogin />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
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
