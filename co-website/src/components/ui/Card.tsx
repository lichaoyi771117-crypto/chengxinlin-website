'use client'

import { forwardRef } from 'react'
import type { HTMLAttributes } from 'react'
import { motion } from 'motion/react'

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'featured'
}

export const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ className, variant = 'default', children, ...props }, ref) => {
    const isFeatured = variant === 'featured'

    return (
      <motion.div
        ref={ref}
        whileHover={{ scale: 1.01 }}
        transition={{ type: 'spring', stiffness: 300, damping: 25 }}
        className="group"
      >
        <div
          className={`
            p-6 h-full border transition-colors duration-300
            ${isFeatured
              ? 'border-copper bg-white'
              : 'border-navy/[0.07] bg-white'
            }
          `}
          {...props}
        >
          {children}
        </div>
      </motion.div>
    )
  }
)

Card.displayName = 'Card'
