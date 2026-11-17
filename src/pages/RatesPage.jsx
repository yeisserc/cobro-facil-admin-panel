import { useState } from 'react'
import { EmptyBlock, ErrorBanner, LoadingBlock, SuccessBanner } from '../components/ui/Feedback'
import { apiRequest } from '../lib/api'
import { formatDateTime, formatRate } from '../lib/format'
import { useAdminResource } from '../lib/useAdminResource'

export default function RatesPage() {
  const { data, error, loading, reload, setError } = useAdminResource('admin/rates')
  const [rate, setRate] = useState('')
  const [notice, setNotice] = useState('')
  const [saving, setSaving] = useState(false)

  async function handleSubmit(event) {
    event.preventDefault()
    setNotice('')
    setError('')
    setSaving(true)
    try {
      await apiRequest('admin/rates', {
        method: 'POST',
        body: JSON.stringify({ currency: 'USD', rate: Number(rate) }),
      })
      setRate('')
      setNotice('Tasa guardada. Los próximos cobros usan este valor.')
      await reload()
    } catch (requestError) {
      setError(requestError.message)
    } finally {
      setSaving(false)
    }
  }

  const history = data?.history?.filter(Boolean) ?? []

  return (
    <section className="page">
      <header className="page-head">
        <div>
          <h1>Tasas</h1>
          <p>La tasa USD vigente. Al guardar una nueva, queda como la última.</p>
        </div>
      </header>

      <ErrorBanner message={error} />
      <SuccessBanner message={notice} />

      <div className="split">
        <article className="panel">
          <h2>Nueva tasa USD</h2>
          <form className="form" onSubmit={handleSubmit}>
            <label className="field">
              <span>Bolívares por dólar</span>
              <input
                type="number"
                inputMode="decimal"
                min="0"
                step="0.0001"
                required
                value={rate}
                onChange={(event) => setRate(event.target.value)}
                placeholder={data?.latest ? formatRate(data.latest.rate) : '0.00'}
              />
            </label>
            <button type="submit" className="btn btn-primary" disabled={saving}>
              {saving ? 'Guardando…' : 'Guardar tasa'}
            </button>
          </form>
        </article>

        <article className="panel">
          <h2>Vigente</h2>
          {loading && !data ? <LoadingBlock /> : null}
          {data?.latest ? (
            <>
              <p className="rate-value">{formatRate(data.latest.rate)}</p>
              <p className="muted">Cargada el {formatDateTime(data.latest.createdAt)}</p>
            </>
          ) : data ? (
            <p className="muted">Todavía no hay una tasa USD.</p>
          ) : null}
        </article>
      </div>

      <article className="panel">
        <h2>Historial</h2>
        {history.length === 0 && data ? (
          <EmptyBlock title="Sin historial" detail="Las tasas que guardes quedan listadas aquí." />
        ) : null}
        {history.length > 0 ? (
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Fecha</th>
                  <th>Moneda</th>
                  <th>Tasa</th>
                </tr>
              </thead>
              <tbody>
                {history.map((item) => (
                  <tr key={item.id}>
                    <td>{formatDateTime(item.createdAt)}</td>
                    <td>{item.currency}</td>
                    <td>{formatRate(item.rate)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : null}
      </article>
    </section>
  )
}
