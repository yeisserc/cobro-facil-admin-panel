const dateTime = new Intl.DateTimeFormat('es-VE', {
  timeZone: 'America/Caracas',
  dateStyle: 'medium',
  timeStyle: 'short',
})

const usd = new Intl.NumberFormat('es-VE', {
  style: 'currency',
  currency: 'USD',
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
})

const rateFormat = new Intl.NumberFormat('es-VE', {
  minimumFractionDigits: 2,
  maximumFractionDigits: 4,
})

export function formatDateTime(value) {
  if (!value) return '—'
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return '—'
  return dateTime.format(date)
}

export function formatUsd(value) {
  return usd.format(Number(value) || 0)
}

export function formatRate(value) {
  return rateFormat.format(Number(value) || 0)
}

export function companyLabel(company) {
  const name = company?.companyName?.trim()
  return name || 'Sin nombre'
}

export function paymentStatusLabel(status) {
  if (status === 'pending') return 'Pendiente'
  if (status === 'rejected') return 'Rechazado'
  if (status === 'verified') return 'Verificado'
  return status || '—'
}
