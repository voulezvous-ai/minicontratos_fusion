import React from 'react'
import { motion } from 'framer-motion'

interface CardProps {
  index: number
  total: number
  title: string
  subtitle?: string
  amount?: string
  onClick?: () => void
}

function Card({
  index,
  total,
  title,
  subtitle,
  amount,
  onClick
}: CardProps) {
  const offset = (total - index) * 8
  return (
    <motion.div
      onClick={onClick}
      className="absolute left-0 right-0 mx-auto w-72 h-44 rounded-2xl px-6 py-4 cursor-pointer select-none bg-gradient-to-br from-gradient-from via-gradient-via to-gradient-to text-primary"
      style={{ top: offset }}
      layoutId={`card-${index}`}
      initial={{ scale: 1 }}
      whileHover={{ scale: 1.02 }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
    >
      <div className="flex flex-col h-full justify-between">
        <div>
          <h3 className="text-lg font-semibold">{title}</h3>
          {subtitle && (
            <p className="text-xs text-secondary mt-1">{subtitle}</p>
          )}
        </div>
        {amount && (
          <p className="text-2xl font-medium tracking-tight">{amount}</p>
        )}
      </div>
    </motion.div>
  )
}

export default Card
