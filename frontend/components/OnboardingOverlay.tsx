import { useState } from 'react'
import { useAppStore } from '../state/useAppStore'

const OnboardingOverlay = () => {
  const { tenantId, userId } = useAppStore()
  const [tenant, setTenantLocal] = useState('')
  const [user, setUserLocal] = useState('')

  if (tenantId && userId) return null

  const submit = () => {
    if (!tenant || !user) return
    localStorage.setItem('tenantId', tenant)
    localStorage.setItem('userId', user)
    window.location.reload()
  }

  return (
    <div className="fixed inset-0 bg-black/90 text-primary flex items-center justify-center z-50">
      <div className="w-80 space-y-4">
        <h1 className="text-center text-lg font-semibold">Primeiro acesso</h1>
        <input
          placeholder="tenant_id"
          className="w-full p-2 bg-neutral-800 border border-neutral-700 rounded"
          value={tenant}
          onChange={(e) => setTenantLocal(e.target.value)}
        />
        <input
          placeholder="user_id"
          className="w-full p-2 bg-neutral-800 border border-neutral-700 rounded"
          value={user}
          onChange={(e) => setUserLocal(e.target.value)}
        />
        <button
          onClick={submit}
          className="w-full py-2 bg-green-600 rounded"
        >
          Entrar
        </button>
      </div>
    </div>
  )
}

export default OnboardingOverlay
