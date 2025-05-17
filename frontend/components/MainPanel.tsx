import React from 'react'
import LeftMenu from './LeftMenu'
import RightMenu from './RightMenu'

interface Props {
  children: React.ReactNode
}

const MainPanel: React.FC<Props> = ({ children }) => {
  return (
    <div className="flex min-h-screen bg-primary text-primary">
      <LeftMenu className="w-14 border-r border-surface" />
      <main className="flex-1 overflow-y-auto">
        {children}
      </main>
      <RightMenu className="w-64 border-l border-surface hidden lg:block" />
    </div>
  )
}

export default MainPanel
