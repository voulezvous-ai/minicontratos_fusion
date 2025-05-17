/**
 * Data helpers to fetch timeline and channel info from backend
 * Provide safe fallbacks to avoid runtime break if backend is offline.
 */

export interface TimelineItem {
  id: string
  title: string
  subtitle: string
  amount: string
}

export async function fetchTimeline(
  tenantId: string,
  userId: string
): Promise<TimelineItem[]> {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE}/timeline/${tenantId}/${userId}`
    )
    if (!res.ok) throw new Error(res.statusText)
    return (await res.json()) as TimelineItem[]
  } catch (err) {
    console.warn('fetchTimeline fallback:', err)
    // fallback dummy list
    return [
      {
        id: 'dummy-1',
        title: 'Demo Subscription',
        subtitle: '1 Jan 2025',
        amount: '€19,90'
      }
    ]
  }
}

export interface Channel {
  id: string
  name: string
}

export async function fetchChannels(
  tenantId: string
): Promise<Channel[]> {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE}/channels/${tenantId}`
    )
    if (!res.ok) throw new Error(res.statusText)
    return (await res.json()) as Channel[]
  } catch (err) {
    console.warn('fetchChannels fallback:', err)
    return [
      { id: 'general', name: 'Geral' },
      { id: 'support', name: 'Suporte' }
    ]
  }
}
