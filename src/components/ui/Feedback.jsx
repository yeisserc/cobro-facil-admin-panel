export function ErrorBanner({ message }) {
  if (!message) return null
  return (
    <p className="banner banner-error" role="alert">
      {message}
    </p>
  )
}

export function SuccessBanner({ message }) {
  if (!message) return null
  return (
    <p className="banner banner-success" role="status">
      {message}
    </p>
  )
}

export function LoadingBlock({ label = 'Cargando…' }) {
  return <p className="loading-block">{label}</p>
}

export function EmptyBlock({ title, detail }) {
  return (
    <div className="empty-block">
      <strong>{title}</strong>
      {detail ? <p>{detail}</p> : null}
    </div>
  )
}
