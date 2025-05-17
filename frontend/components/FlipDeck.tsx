import React from 'react'
import { motion } from 'framer-motion'
import { useAppStore, faceIndex, nextFace, prevFace } from '../state/useAppStore'
import ChatPage from '../apps/chat/pages'
import MessagesPage from '../apps/messages/pages'
import TimelinePage from '../apps/timeline/pages'

const faces = [<ChatPage />, <MessagesPage />, <TimelinePage />]

const FlipDeck: React.FC = () => {
  const { mode, setMode } = useAppStore()
  const idx = faceIndex[mode]
  const angle = idx * -120

  return (
    <div className="perspective-1000 w-full h-full flex items-center justify-center">
      <motion.div
        className="relative w-full h-full"
        style={{ transformStyle: 'preserve-3d' }}
        animate={{ rotateY: angle }}
        transition={{ type: 'spring', stiffness: 80, damping: 15 }}
        drag="x"
        dragConstraints={{ left: 0, right: 0 }}
        onDragEnd={(_, info) => {
          if (info.offset.x < -100) setMode(nextFace(mode))
          if (info.offset.x > 100) setMode(prevFace(mode))
        }}
      >
        {faces.map((Face, i) => (
          <div
            key={i}
            className="absolute inset-0 backface-hidden origin-center"
            style={{ transform: `rotateY(${i * 120}deg) translateZ(0.1px)` }}
          >
            {Face}
          </div>
        ))}
      </motion.div>
    </div>
  )
}

export default FlipDeck
