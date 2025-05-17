import React, { useState } from 'react'

interface Props {
  onSend: (text: string) => void
}

const ChatInput: React.FC<Props> = ({ onSend }) => {
  const [value, setValue] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const txt = value.trim()
    if (!txt) return
    onSend(txt)
    setValue('')
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="flex p-4 border-t border-surface bg-primary"
    >
      <input
        type="text"
        className="flex-1 bg-transparent outline-none text-primary placeholder:text-secondary"
        placeholder="Digite sua mensagem..."
        value={value}
        onChange={(e) => setValue(e.target.value)}
      />
      <button
        type="submit"
        className="ml-2 px-3 py-1 rounded bg-surface border border-neutral-700 hover:bg-neutral-800 text-sm"
      >
        Enviar
      </button>
    </form>
  )
}

export default ChatInput
