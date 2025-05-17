import React from 'react'

interface Props {
  role: 'user' | 'processed'
  text: string
  valid?: boolean
  ghost?: boolean
  missing?: string[]
}

const ChatMessage: React.FC<Props> = ({
  role,
  text,
  valid,
  ghost,
  missing
}) => {
  const isUser = role === 'user'
  const badges =
    role === 'processed' ? (
      <span className="ml-2 text-xs">
        {valid ? '✅' : '⚠️'} {ghost && '👻'}{' '}
        {missing && missing.length > 0 && `⚠️${missing.length}`}
      </span>
    ) : null

  return (
    <div
      className={`max-w-xl px-4 py-2 rounded-lg text-sm leading-relaxed ${
        isUser
          ? 'ml-auto bg-surface border border-neutral-700'
          : 'mr-auto bg-gradient-to-b from-gradient-from via-gradient-via to-gradient-to'
      }`}
    >
      {text}
      {badges}
    </div>
  )
}

export default ChatMessage
