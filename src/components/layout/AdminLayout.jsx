import { NavLink, Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { APP_NAME } from '../../lib/constants'

const LINKS = [
  { to: '/', label: 'Resumen', end: true },
  { to: '/empresas', label: 'Empresas' },
  { to: '/operacion', label: 'Operación' },
  { to: '/tasas', label: 'Tasas' },
]

export function ProtectedRoute() {
  const { session } = useAuth()
  if (!session) return <Navigate to="/login" replace />
  return <AdminLayout />
}

function AdminLayout() {
  const { user, logout } = useAuth()

  return (
    <div className="shell">
      <aside className="sidebar">
        <div className="brand">
          <p className="brand-mark">{APP_NAME}</p>
          <p className="brand-tag">Administración</p>
        </div>

        <nav className="side-nav" aria-label="Secciones">
          {LINKS.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.end}
              className={({ isActive }) => `side-link${isActive ? ' active' : ''}`}
            >
              {link.label}
            </NavLink>
          ))}
        </nav>

        <div className="side-footer">
          <p className="side-email" title={user?.email}>
            {user?.email}
          </p>
          <button type="button" className="btn btn-quiet" onClick={logout}>
            Salir
          </button>
        </div>
      </aside>

      <main className="main">
        <Outlet />
      </main>
    </div>
  )
}
