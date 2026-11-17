import { EmptyBlock, ErrorBanner, LoadingBlock } from '../components/ui/Feedback'
import { API_URL } from '../lib/constants'
import { companyLabel, formatDateTime, formatUsd, paymentStatusLabel } from '../lib/format'
import { useAdminResource } from '../lib/useAdminResource'

export default function OperationsPage() {
  const { data, error, loading, reload } = useAdminResource('admin/operations')

  return (
    <section className="page">
      <header className="page-head">
        <div>
          <h1>Operación</h1>
          <p>Envíos de WhatsApp con error y pagos pendientes o rechazados. Los últimos 40 de cada uno.</p>
        </div>
        <button type="button" className="btn btn-quiet" onClick={reload} disabled={loading}>
          Actualizar
        </button>
      </header>

      <ErrorBanner message={error} />
      {loading && !data ? <LoadingBlock /> : null}

      {data ? (
        <>
          <article className="panel">
            <h2>Envíos fallidos</h2>
            {data.failedSends.length === 0 ? (
              <EmptyBlock title="Sin fallos recientes" detail="No hay envíos marcados con error." />
            ) : (
              <div className="table-wrap">
                <table>
                  <thead>
                    <tr>
                      <th>Cuándo</th>
                      <th>Empresa</th>
                      <th>Cliente</th>
                      <th>Cuota</th>
                      <th>Monto</th>
                      <th>Detalle</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.failedSends.map((send) => (
                      <tr key={send.id}>
                        <td>{formatDateTime(send.sentAt)}</td>
                        <td>
                          <strong>{companyLabel(send)}</strong>
                          <span className="cell-sub">{send.companyEmail}</span>
                        </td>
                        <td>{send.clientName}</td>
                        <td>{send.installmentNumber}</td>
                        <td>{formatUsd(send.amountUsd)}</td>
                        <td className="cell-error">{send.whatsappError || send.whatsappStatus}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </article>

          <article className="panel">
            <h2>Pagos pendientes y rechazados</h2>
            {data.payments.length === 0 ? (
              <EmptyBlock title="Nada en revisión" detail="No hay pagos pendientes ni rechazados." />
            ) : (
              <div className="table-wrap">
                <table>
                  <thead>
                    <tr>
                      <th>Cuándo</th>
                      <th>Empresa</th>
                      <th>Cliente</th>
                      <th>Cuota</th>
                      <th>Monto</th>
                      <th>Estado</th>
                      <th>Referencia</th>
                      <th />
                    </tr>
                  </thead>
                  <tbody>
                    {data.payments.map((payment) => (
                      <tr key={payment.id}>
                        <td>{formatDateTime(payment.createdAt)}</td>
                        <td>
                          <strong>{companyLabel(payment)}</strong>
                          <span className="cell-sub">{payment.companyEmail}</span>
                        </td>
                        <td>{payment.clientName}</td>
                        <td>{payment.installmentNumber}</td>
                        <td>{formatUsd(payment.amountUsd)}</td>
                        <td>
                          <span className={`pill ${payment.status === 'rejected' ? 'pill-warn' : 'pill-off'}`}>
                            {paymentStatusLabel(payment.status)}
                          </span>
                        </td>
                        <td>{payment.referenceNumber || '—'}</td>
                        <td className="cell-action">
                          {payment.hasScreenshot ? (
                            <a
                              className="text-link"
                              href={`${API_URL}/payments/${payment.id}/screenshot`}
                              target="_blank"
                              rel="noreferrer"
                            >
                              Comprobante
                            </a>
                          ) : (
                            '—'
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </article>
        </>
      ) : null}
    </section>
  )
}
