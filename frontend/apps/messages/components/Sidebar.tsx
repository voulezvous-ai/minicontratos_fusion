import React from 'react'
import { useAppStore } from '../../../state/useAppStore'
import { fetchChannels } from '../../../lib/data'

interface Contact {
  id: string
  name: string
}

const [contacts, setContacts] = React.useState<Channel[]>([]) = [
  { id: 'general', name: 'Geral' },
  { id: 'support', name: 'Suporte' },
  { id: 'marketing', name: 'Marketing' }
]

interface Props {
  className?: string
}

const Sidebar: React.FC<Props> = ({ className }) => {
  const { mode, setMode } = useAppStore()
  React.useEffect(() => {
  fetchChannels(process.env.NEXT_PUBLIC_TENANT_ID || '').then(setContacts)
}, [])

  return (
    <aside
      className={\`flex flex-col bg-surface border-r border-surface \${className}\`}
    >
      <h2 className="p-3 text-sm font-semibold border-b border-surface">
        Canais
      </h2>
      <nav className="flex-1 overflow-y-auto">
        {contacts.map((c) => (
          <button
            key={c.id}
            onClick={() => setMode('messages')}
            className="w-full text-left px-4 py-2 text-sm hover:bg-neutral-800"
          >
            {c.name}
          </button>
        ))}
      </nav>
    </aside>
  )
}

export default Sidebar
