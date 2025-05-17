import React, { useState } from 'react'
import ChatMessage from './ChatMessage'
import ChatInput from './ChatInput'
import { postProcess } from '../../../lib/api'

interface Msg {
  id: string
  text: string
  role: 'user' | 'processed'
  valid?: boolean
  ghost?: boolean
  missing?: string[]
}

const Chat: React.FC = () => {
  const [messages, setMessages] = useState<Msg[]>([])

  const handleSend = async (text: string) => {
    const localId = Date.now().toString()
    setMessages((prev) => [...prev, { id: localId, text, role: 'user' }])

    try {
      const meta = await postProcess(text, 'chat')
      setMessages((prev) => [
        ...prev,
        {
          id: meta.id,
          text,
          role: 'processed',
          valid: meta.valid,
          ghost: meta.ghost,
          missing: meta.missing
        }
      ])
    } catch (err) {
      console.error(err)
    }
  }

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto p-4 space-y-2">
        {messages.map((m) => (
          <ChatMessage key={m.id} {...m} />
        ))}
      </div>
      <ChatInput onSend={handleSend} />
    </div>
  )
}

export default Chat
