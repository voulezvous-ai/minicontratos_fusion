import React, { useState } from 'react'
import { LogLine } from './LogLineCard'
import { useAppStore } from '../state/useAppStore'

interface Props {
  log: LogLine
  onClose: () => void
}

const FIELD_LABELS: Record<string, string> = {
  who: 'Quem',
  did: 'Fez',
  this: 'Isto',
  when: 'Quando',
  confirmed_by: 'Confirmado por',
  if_ok: 'Se OK',
  if_doubt: 'Se dúvida',
  if_not: 'Se não',
  status: 'Status'
}

const LogLineEditor: React.FC<Props> = ({ log, onClose }) => {
  const { updateLog } = useAppStore()
  const [values, setValues] = useState<Record<string, string>>({})

  const handleChange = (field: string, val: string) => {
    setValues((prev) => ({ ...prev, [field]: val }))
  }

  const handleSubmit = async () => {
    const res = await fetch(
      `/logs/${log.id}?tenant_id=${process.env.NEXT_PUBLIC_TENANT_ID}`,
      {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ updates: values })
      }
    )
    const data = await res.json()
    updateLog(data.log)
    onClose()
  }

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-30">
      <div className="bg-surface p-6 rounded-lg w-96">
        <h2 className="text-sm font-semibold mb-4">Completar Log</h2>
        {log.missing.map((field) => (
          <div key={field} className="mb-3">
            <label className="block text-xs mb-1">{FIELD_LABELS[field]}</label>
            <input
              type="text"
              className="w-full bg-neutral-800 border border-neutral-700 p-1 text-sm rounded"
              value={values[field] || ''}
              onChange={(e) => handleChange(field, e.target.value)}
            />
          </div>
        ))}
        <div className="flex justify-end space-x-2">
          <button
            onClick={onClose}
            className="px-3 py-1 text-xs border border-neutral-600 rounded"
          >
            Cancelar
          </button>
          <button
            onClick={handleSubmit}
            className="px-3 py-1 text-xs bg-green-600 rounded"
          >
            Salvar
          </button>
        </div>
      </div>
    </div>
  )
}

export default LogLineEditor
