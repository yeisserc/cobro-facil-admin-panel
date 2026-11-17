import { API_URL, TOKEN_KEY } from './constants'

let onUnauthorized = () => {}

export function setUnauthorizedHandler(handler) {
  onUnauthorized = handler
}

function translateErrorMessage(message) {
  if (!message) return 'No se pudo completar la solicitud.'
  if (Array.isArray(message)) return message.map(translateErrorMessage).join(', ')

  const text = String(message).trim()
  if (text === 'Unauthorized') return 'No autorizado.'
  if (text === 'Forbidden') return 'Acceso denegado.'
  if (text === 'Bad Request Exception') return 'Solicitud incorrecta.'
  if (text === 'Not Found') return 'No encontrado.'
  if (text === 'Internal Server Error') return 'Error interno del servidor.'
  return text || 'No se pudo completar la solicitud.'
}

export async function apiRequest(path, options = {}) {
  const token = localStorage.getItem(TOKEN_KEY)
  const headers = {
    ...(options.body ? { 'Content-Type': 'application/json' } : {}),
    ...(options.headers || {}),
  }

  if (token) {
    headers.Authorization = `Bearer ${token}`
  }

  const response = await fetch(`${API_URL}/${path}`, {
    ...options,
    headers,
  })

  const text = await response.text()
  let data = null
  if (text) {
    try {
      data = JSON.parse(text)
    } catch {
      data = text
    }
  }

  if (!response.ok) {
    const rawMessage =
      (data && typeof data === 'object' && (data.message || data.error)) ||
      (typeof data === 'string' ? data : null) ||
      'No se pudo completar la solicitud.'
    if (response.status === 401 && path !== 'admin/login') {
      onUnauthorized()
    }
    throw new Error(translateErrorMessage(rawMessage))
  }

  return data
}
