export class ApiError extends Error {
  constructor(status, message, details) {
    super(message)
    this.status = status
    this.details = details
  }
}

// Fired when an authenticated call gets 401 (session expired, account deactivated or password reset).
// AuthProvider listens and switches to guest, which sends the user back to /login.
export const AUTH_EXPIRED_EVENT = 'spk:auth-expired'

export async function api(path, { method = 'GET', body, headers } = {}) {
  const isForm = body instanceof FormData
  const res = await fetch(`/api${path}`, {
    method,
    credentials: 'include',
    headers: isForm || body === undefined ? headers : { 'Content-Type': 'application/json', ...headers },
    body: isForm || body === undefined ? body : JSON.stringify(body),
  })

  const data = res.headers.get('content-type')?.includes('application/json') ? await res.json() : null

  if (!res.ok) {
    if (res.status === 401 && !path.startsWith('/auth/')) {
      window.dispatchEvent(new Event(AUTH_EXPIRED_EVENT))
    }
    throw new ApiError(res.status, data?.error?.message ?? `HTTP ${res.status}`, data?.error?.details)
  }
  return data
}

// withQuery('/users', { q: '', role: 'rt', page: 2 }) → '/users?role=rt&page=2' (empty values dropped)
export function withQuery(path, params) {
  const search = new URLSearchParams()
  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined && value !== null && value !== '') search.set(key, value)
  }
  const query = search.toString()
  return query ? `${path}?${query}` : path
}
