export class ApiError extends Error {
  constructor(status, message, details) {
    super(message)
    this.status = status
    this.details = details
  }
}

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
    throw new ApiError(res.status, data?.error?.message ?? `HTTP ${res.status}`, data?.error?.details)
  }
  return data
}
