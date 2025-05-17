import React from 'react'
import { LogLine } from '../types/log'


const fieldClasses = (missing: boolean) =>
  missing ? 'border border-yellow-500/60' : ''

const LogLineCard: React.FC<{ log: LogLine; onSelect?: () => void }> = ({
  log,
  onSelect
}) => {
  return (
    <div role="button" aria-label="Log line"
      onClick={onSelect}
      className={`p-4 rounded-lg mb-2 cursor-pointer ${
        log.ghost ? 'border border-dashed border-neutral-600' : 'bg-surface'
      }`}
    >
      <div role="button" aria-label="Log line" className="flex justify-between items-center">
        <h3 className="text-sm font-semibold">{log.who}</h3>
        {log.valid && (
          <span className="text-xs text-green-400 border border-green-400 px-1 rounded">
            valid
          </span>
        )}
        {log.ghost && !log.valid && (
          <span className="text-xs text-yellow-500 border border-yellow-500 px-1 rounded">
            ghost
          </span>
        )}
      </div>
      <div role="button" aria-label="Log line" className="grid grid-cols-2 text-xs gap-1 mt-2">
  {Object.entries(log).map(([k, v]) => (
    k === 'id' || k === 'missing' || k === 'ghost' || k === 'valid'
      ? null :
      <div role="button" aria-label="Log line"
        key={k}
        className={\`col-span-2 \${fieldClasses(k, log.missing)}\`}
      >
        <span className="font-semibold">{k}: </span>
        <span>{String(v ?? '')}</span>
      </div>
  ))}
</div>
