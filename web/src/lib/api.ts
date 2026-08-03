import type { WrappedPayload } from '../types'

const BASE = import.meta.env.VITE_API_BASE ?? 'http://localhost:8787'

export async function fetchWrapped(username: string, signal?: AbortSignal): Promise<WrappedPayload> {
  const res = await fetch(`${BASE}/api/wrapped?username=${encodeURIComponent(username)}`, { signal })
  if (!res.ok) {
    const body = (await res.json().catch(() => null)) as { message?: string } | null
    throw new Error(body?.message ?? `Request failed (${res.status})`)
  }
  return res.json()
}
