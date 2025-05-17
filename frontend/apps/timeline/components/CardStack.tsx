import React, { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Card from './Card'
import { postProcess } from '../../../lib/api'
import { fetchTimeline } from '../../../lib/data'

interface Line {
  id: string
  title: string
  subtitle: string
  amount: string
}

const dummy: Line[] = [
  { id: '1', title: 'Assinatura Pro', subtitle: '15 Mai 2025', amount: '€19,90' },
  { id: '2', title: 'Cashback', subtitle: '12 Mai 2025', amount: '€-4,50' },
  { id: '3', title: 'Upgrade Storage', subtitle: '10 Mai 2025', amount: '€9,99' }
]

const CardStack = () => {
  const [lines, setLines] = useState<Line[]>([])
  const [active, setActive] = useState<number | null>(null)

  useEffect(() => {
    fetchTimeline(process.env.NEXT_PUBLIC_TENANT_ID || '', process.env.NEXT_PUBLIC_USER_ID || '')
      .then(setLines)
  }, [])

  return (
    <div>
      {/* Render cards here if needed */}
      <AnimatePresence>
        {active !== null && (
          <motion.div
            className="fixed inset-0 bg-black/80 flex items-center justify-center z-20"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              layoutId={`card-${active}`}
              className="w-80 h-48 rounded-2xl p-6 bg-gradient-to-br from-gradient-from via-gradient-via to-gradient-to"
            >
              <h2 className="text-xl font-semibold">{lines[active].title}</h2>
              <p className="text-sm text-secondary">{lines[active].subtitle}</p>
              <p className="text-3xl mt-6">{lines[active].amount}</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default CardStack
