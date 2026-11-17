import { Navigate, Route, Routes } from 'react-router-dom'
import { ProtectedRoute } from '../components/layout/AdminLayout'
import CompaniesPage from '../pages/CompaniesPage'
import LoginPage from '../pages/LoginPage'
import OperationsPage from '../pages/OperationsPage'
import RatesPage from '../pages/RatesPage'
import SummaryPage from '../pages/SummaryPage'

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route element={<ProtectedRoute />}>
        <Route path="/" element={<SummaryPage />} />
        <Route path="/empresas" element={<CompaniesPage />} />
        <Route path="/operacion" element={<OperationsPage />} />
        <Route path="/tasas" element={<RatesPage />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
