import React, { useState } from 'react'
import MessageBubble from './MessageBubble'
import { postProcess } from '../../../lib/api'

interface Msg {
  id: string
  text: string
  me: boolean
  meta?: {
    valid: boolean
    ghost: boolean
    missing: string[]
  }
}

const ChatWindow: React.FC = () => {
  const [messages, setMessages] = useState<Msg[]>([])
  const [value, setValue] = useState('')

  const handleSend = async () => {
    const txt = value.trim()
    if (!txt) return
    setValue('')
    const localId = Date.now().toString()
    setMessages((prev) => [...prev, { id: localId, text: txt, me: true }])

    try {
      const meta = await postProcess(txt, 'messages')
      setMessages((prev) => [
        ...prev,
        {
          id: meta.id,
          text: txt,
          me: false,
          meta
        }
      ])
    } catch (err) {
      console.error(err)
    }
  }

  return (
    <div className="flex flex-col h-full flex-1">
      <div className="flex-1 overflow-y-auto p-4">
        {messages.map((m) => (
          <MessageBubble key={m.id} me={m.me} text={m.text} meta={m.meta} />
        ))}
      </div>
      <div className="p-4 border-t border-surface flex">
        <input
          className="flex-1 bg-transparent outline-none text-primary placeholder:text-secondary"
          placeholder="Mensagem..."
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
        />
        <button
          onClick={handleSend}
          className="ml-2 px-3 py-1 rounded bg-surface border border-neutral-700 hover:bg-neutral-800 text-sm"
        >
          Enviar
        </button>
      </div>
    </div>
  )
}

export default ChatWindow
