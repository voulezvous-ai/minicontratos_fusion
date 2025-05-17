import { create, StateCreator } from 'zustand'

export type Mode = 'chat' | 'messages' | 'timeline'

import { LogLine } from "../types/log"

interface AppState {
  mode: Mode
  tenantId: string
  userId: string
  autoLLM: boolean
  setMode: (m: Mode) => void
  setAutoLLM: (flag: boolean) => void
  logs?: LogLine[]
  selectedLog?: LogLine
  loadLogs: (tenantId: string) => Promise<void>
  selectLog: (log: LogLine) => void
  updateLog: (l: LogLine) => void
}

export const useAppStore = create<AppState>((set) => ({
  mode: 'chat',
  tenantId: process.env.NEXT_PUBLIC_TENANT_ID || '',
  userId: process.env.NEXT_PUBLIC_USER_ID || '',
  autoLLM: true,
  setMode: (mode: Mode) => set({ mode }),
  setAutoLLM: (flag: boolean) => set({ autoLLM: flag }),
  logs: [],
  selectedLog: undefined,
  loadLogs: async (tenantId: string) => {
    const res = await fetch(`/logs?tenant_id=${tenantId}`)
    const data: LogLine[] = await res.json()
    set({ logs: data })
  },
  selectLog: (log: LogLine) => set({ selectedLog: log }),
  updateLog: (l: LogLine) => set((s) => ({
    logs: s.logs ? s.logs.map((o) => (o.id === l.id ? l : o)) : [],
    selectedLog: l
  }))
}))

// helper mapping modes to card face index
export const faceIndex: Record<Mode, number> = { chat: 0, messages: 1, timeline: 2 }
export const nextFace = (m: Mode): Mode => {
  const order: Mode[] = ['chat','messages','timeline']
  return order[(order.indexOf(m)+1)%3]
}
export const prevFace = (m: Mode): Mode => {
  const order: Mode[] = ['chat','messages','timeline']
  return order[(order.indexOf(m)+2)%3]
}
