import React from 'react'

interface Props {
  me: boolean
  text: string
  meta?: {
    valid: boolean
    ghost: boolean
    missing: string[]
  }
}

const MessageBubble: React.FC<Props> = ({ me, text, meta }) => {
  return (
    <div
      className={`${me ? 'ml-auto' : 'mr-auto'} max-w-lg mb-1 flex`}
    >
      <div
        className={
          `px-3 py-2 rounded-lg text-sm break-words ` +
          (me
            ? 'bg-surface border border-neutral-700'
            : 'bg-gradient-to-b from-gradient-from via-gradient-via to-gradient-to')
        }
      >
        {text}
        {meta && (
          <span className="ml-2 text-xs">
            {meta.valid ? '✅' : '⚠️'} {meta.ghost && '👻'}{' '}
            {meta.missing.length > 0 && `⚠️${meta.missing.length}`}
          </span>
        )}
      </div>
    </div>
  )
}

export default MessageBubble
