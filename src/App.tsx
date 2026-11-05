import { Navigate, Route, Routes } from 'react-router'
import { RequireAuth, RequireRole } from './auth/guards'
import { AppLayout } from './components/layout/AppLayout'
import { DashboardPage } from './pages/DashboardPage'
import { DeviceListPage } from './pages/DeviceListPage'
import { DeviceProfilePage } from './pages/DeviceProfilePage'
import { DistressHistoryPage } from './pages/DistressHistoryPage'
import { OperatorsPage } from './pages/OperatorsPage'
import { SystemLogsPage } from './pages/SystemLogsPage'
import { AuthLayout } from './pages/auth/AuthLayout'
import { ForgotPasswordPage } from './pages/auth/ForgotPasswordPage'
import { LoginPage } from './pages/auth/LoginPage'
import { ResetPasswordPage } from './pages/auth/ResetPasswordPage'
import { VerifyCodePage } from './pages/auth/VerifyCodePage'

export default function App() {
  return (
    <Routes>
      <Route element={<AuthLayout />}>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/verify-code" element={<VerifyCodePage />} />
        <Route path="/reset-password" element={<ResetPasswordPage />} />
      </Route>

      <Route
        element={
          <RequireAuth>
            <AppLayout />
          </RequireAuth>
        }
      >
        <Route index element={<Navigate to="/map" replace />} />
        <Route path="/map" element={<DashboardPage />} />
        <Route path="/devices" element={<DeviceListPage />} />
        <Route path="/devices/:deviceId" element={<DeviceProfilePage />} />
        <Route path="/history" element={<DistressHistoryPage />} />
        <Route element={<RequireRole role="admin" />}>
          <Route path="/operators" element={<OperatorsPage />} />
          <Route path="/logs" element={<SystemLogsPage />} />
        </Route>
      </Route>

      <Route path="*" element={<Navigate to="/map" replace />} />
    </Routes>
  )
}
