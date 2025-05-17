import React, { useState } from 'react'
import { useAppStore } from '../state/useAppStore'
import LogLineEditor from './LogLineEditor'

const RightMenu: React.FC<{ className?: string }> = ({ className }) => {
  const { mode, autoLLM, setAutoLLM, selectedLog } = useAppStore()
  const [editorOpen, setEditorOpen] = useState(false)

  // Dummy handlers for now
  const handleComplete = () => {}
  const confirmEvent = () => {}
  const invalidate = () => {}

  return (
    <aside
      className={"bg-surface text-primary p-4 space-y-4 " + (className || "")}
    >
      <h2 className="text-sm font-semibold">Painel</h2>
      <p className="text-xs text-secondary">Modo atual: {mode}</p>

      <label className="flex items-center text-xs">
        <input
          type="checkbox"
          checked={autoLLM}
          onChange={(e) => setAutoLLM(e.target.checked)}
          className="mr-2"
        />
        Auto LLM
      </label>

      {/* Espaço para logs, stats, filtros etc. */}
      <div className="text-xs text-secondary">Logs futuros…</div>
    
  {/* Ações de LogLine */}
  {selectedLog && (
    <div className="space-y-2">
      <h3 className="text-xs font-semibold">Ações</h3>
      {selectedLog.ghost && (
        <button
          onClick={handleComplete}
          className="w-full text-left text-xs px-2 py-1 border border-neutral-600 rounded hover:bg-neutral-800"
        >
          Completar contrato
        </button>
      )}
      <button
        onClick={confirmEvent}
        className="w-full text-left text-xs px-2 py-1 border border-neutral-600 rounded hover:bg-neutral-800"
      >
        Confirmar evento
      </button>
      <button
        onClick={invalidate}
        className="w-full text-left text-xs px-2 py-1 border border-red-600 text-red-400 rounded hover:bg-red-600/20"
      >
        Invalidar
      </button>
    </div>
  )}

  {editorOpen && selectedLog && (
    <LogLineEditor log={selectedLog} onClose={() => setEditorOpen(false)} />
  )}
</aside>

  )
}

export default RightMenu
