import { ErrorBanner, LoadingBlock } from '../components/ui/Feedback'
import { formatRate, formatUsd } from '../lib/format'
import { useAdminResource } from '../lib/useAdminResource'

export default function SummaryPage() {
  const { data, error, loading, reload } = useAdminResource('admin/summary')

  return (
    <section className="page">
      <header className="page-head">
        <div>
          <h1>Resumen</h1>
          <p>Estado de la operación de hoy, en hora de Caracas.</p>
        </div>
        <button type="button" className="btn btn-quiet" onClick={reload} disabled={loading}>
          Actualizar
        </button>
      </header>

      <ErrorBanner message={error} />
      {loading && !data ? <LoadingBlock /> : null}

      {data ? (
        <>
          <div className="stat-grid">
            <article className="stat">
              <span>Cuentas</span>
              <strong>{data.companies}</strong>
            </article>
            <article className="stat">
              <span>Cobranzas activas</span>
              <strong>{data.activeCollections}</strong>
            </article>
            <article className="stat">
              <span>Verificados hoy</span>
              <strong>{data.payments.verifiedToday}</strong>
              <small>{formatUsd(data.payments.receivedTodayUsd)}</small>
            </article>
            <article className="stat">
              <span>Pagos por revisar</span>
              <strong>{data.payments.pending + data.payments.rejected}</strong>
              <small>
                {data.payments.pending} pendientes · {data.payments.rejected} rechazados
              </small>
            </article>
          </div>

          <div className="split">
            <article className="panel">
              <h2>Tasa USD</h2>
              {data.latestUsdRate ? (
                <>
                  <p className="rate-value">{formatRate(data.latestUsdRate.rate)}</p>
                  <p className="muted">Bs por dólar, la tasa vigente que usa la cobranza.</p>
                </>
              ) : (
                <p className="muted">Todavía no hay una tasa USD cargada.</p>
              )}
            </article>

            <article className="panel">
              <h2>Sistema</h2>
              <ul className="status-list">
                <StatusRow label="WhatsApp" on={data.jobs.whatsappConfigured} />
                <StatusRow label="Verificación de pagos" on={data.jobs.paymentVerificationEnabled} />
                <StatusRow label="Recordatorios de cobro" on={data.jobs.paymentDueRemindersEnabled} />
              </ul>
            </article>
          </div>
        </>
      ) : null}
    </section>
  )
}

function StatusRow({ label, on }) {
  return (
    <li>
      <span>{label}</span>
      <span className={`pill ${on ? 'pill-ok' : 'pill-off'}`}>{on ? 'Activo' : 'Apagado'}</span>
    </li>
  )
}
