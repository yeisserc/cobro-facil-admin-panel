import { useState } from 'react'
import { EmptyBlock, ErrorBanner, LoadingBlock, SuccessBanner } from '../components/ui/Feedback'
import { apiRequest } from '../lib/api'
import { companyLabel, formatDateTime } from '../lib/format'
import { useAdminResource } from '../lib/useAdminResource'

export default function CompaniesPage() {
  const { data, error, loading, reload, setError } = useAdminResource('admin/companies')
  const [notice, setNotice] = useState('')
  const [savingId, setSavingId] = useState('')

  async function toggleCompany(company) {
    const nextActive = !company.isActive
    if (!nextActive) {
      const confirmed = window.confirm(
        `¿Desactivar a ${companyLabel(company)}? No podrá entrar a CobroFácil hasta que la actives.`,
      )
      if (!confirmed) return
    }

    setNotice('')
    setError('')
    setSavingId(company.id)
    try {
      await apiRequest(`admin/companies/${company.id}`, {
        method: 'PATCH',
        body: JSON.stringify({ isActive: nextActive }),
      })
      setNotice(nextActive ? 'Cuenta activada.' : 'Cuenta desactivada.')
      await reload()
    } catch (requestError) {
      setError(requestError.message)
    } finally {
      setSavingId('')
    }
  }

  const companies = data ?? []

  return (
    <section className="page">
      <header className="page-head">
        <div>
          <h1>Empresas</h1>
          <p>Cuentas registradas. Desactivar una cuenta le cierra el ingreso a la app.</p>
        </div>
      </header>

      <ErrorBanner message={error} />
      <SuccessBanner message={notice} />
      {loading && !data ? <LoadingBlock /> : null}

      {data && companies.length === 0 ? (
        <EmptyBlock title="No hay cuentas" detail="Cuando alguien se registre, aparece aquí." />
      ) : null}

      {companies.length > 0 ? (
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Empresa</th>
                <th>Contacto</th>
                <th>Banco</th>
                <th>Datos de pago</th>
                <th>Clientes</th>
                <th>Cobranzas</th>
                <th>Alta</th>
                <th>Estado</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {companies.map((company) => (
                <tr key={company.id}>
                  <td>
                    <strong>{companyLabel(company)}</strong>
                    <span className="cell-sub">{company.email}</span>
                  </td>
                  <td>{company.phoneNumber || '—'}</td>
                  <td>
                    <span className={`pill ${company.bankConnected ? 'pill-ok' : 'pill-off'}`}>
                      {company.bankConnected ? 'Conectado' : 'Sin banco'}
                    </span>
                  </td>
                  <td>
                    <span className={`pill ${company.paymentDetailsReady ? 'pill-ok' : 'pill-warn'}`}>
                      {company.paymentDetailsReady ? 'Listos' : 'Incompletos'}
                    </span>
                  </td>
                  <td>{company.clientsCount}</td>
                  <td>{company.collectionsCount}</td>
                  <td>{formatDateTime(company.createdAt)}</td>
                  <td>
                    {company.role === 'admin' ? (
                      <span className="pill pill-admin">Administrador</span>
                    ) : (
                      <span className={`pill ${company.isActive ? 'pill-ok' : 'pill-off'}`}>
                        {company.isActive ? 'Activa' : 'Inactiva'}
                      </span>
                    )}
                  </td>
                  <td className="cell-action">
                    {company.role === 'admin' ? null : (
                      <button
                        type="button"
                        className={`btn ${company.isActive ? 'btn-danger' : 'btn-primary'}`}
                        disabled={savingId === company.id}
                        onClick={() => toggleCompany(company)}
                      >
                        {savingId === company.id
                          ? 'Guardando…'
                          : company.isActive
                            ? 'Desactivar'
                            : 'Activar'}
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : null}
    </section>
  )
}
