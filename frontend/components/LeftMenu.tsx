import React from 'react'
import { useAppStore } from '../state/useAppStore'
import { MessageCircle, Send, CreditCard } from 'lucide-react'

const menu = [
  { id: 'chat', label: 'Chat', icon: Send },
  { id: 'messages', label: 'Msgs', icon: MessageCircle },
  { id: 'timeline', label: 'Cards', icon: CreditCard }
] as const

const LeftMenu: React.FC<{ className?: string }> = ({ className }) => {
  const { mode, setMode } = useAppStore()
  return (
    <nav
      className={\`flex flex-col bg-surface text-secondary items-center py-4 \${className}\`}
    >
      {menu.map((m) => {
        const Icon = m.icon
        const active = mode === m.id
        return (
          <button
            key={m.id}
            onClick={() => setMode(m.id as any)}
            className={\`my-2 p-2 rounded-lg hover:bg-neutral-800 focus:outline-none
              \${active ? 'bg-neutral-800 text-primary' : ''}\`}
            title={m.label}
          >
            <Icon size={20} />
          </button>
        )
      })}
    </nav>
  )
}

export default LeftMenu
