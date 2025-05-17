import React from 'react'
import { useEffect } from 'react'
import { useAppStore } from '../../../state/useAppStore'

import CardStack from '../components/CardStack'
import MainPanel from '../../../components/MainPanel'

const TimelinePage: React.FC = () => {
  const { loadLogs } = useAppStore()
useEffect(() => {
  loadLogs(process.env.NEXT_PUBLIC_TENANT_ID || '')
}, [])

  return (
    <MainPanel>
      <CardStack />
    </MainPanel>
  )
}

export default TimelinePage
