'use client'

import { forwardRef } from 'react'
import type { ButtonHTMLAttributes, ReactNode } from 'react'
import { motion } from 'motion/react'
import { cva, type VariantProps } from 'class-variance-authority'

const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 font-medium whitespace-nowrap transition-colors cursor-pointer select-none text-xs tracking-wider',
  {
    variants: {
      variant: {
        copper:
          'bg-copper text-navy hover:bg-copper-light',
        secondary:
          'bg-white text-navy border border-navy/10 hover:bg-paper',
        ghost:
          'text-slate hover:text-navy hover:bg-navy/[0.03]',
        'ghost-light':
          'text-paper/70 hover:text-paper hover:bg-white/[0.08]',
        danger:
          'bg-error text-white hover:bg-red-600',
        outline:
          'border border-copper text-copper hover:bg-copper hover:text-navy',
      },
      size: {
        sm: 'px-4 py-2 text-xs',
        md: 'px-6 py-3 text-xs',
        lg: 'px-8 py-4 text-sm',
      },
    },
    defaultVariants: {
      variant: 'copper',
      size: 'md',
    },
  }
)

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement>, VariantProps<typeof buttonVariants> {
  trailingIcon?: ReactNode
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, children, trailingIcon, ...props }, ref) => {
    return (
      <motion.button
        ref={ref}
        whileTap={{ scale: 0.97 }}
        whileHover={{ scale: 1.02 }}
        transition={{ type: 'spring', stiffness: 400, damping: 25 }}
        className={buttonVariants({ variant, size, className })}
        {...(props as any)}
      >
        <span>{children}</span>
        {trailingIcon && (
          <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-navy/10 group-hover:translate-x-0.5 transition-transform duration-300">
            {trailingIcon}
          </span>
        )}
      </motion.button>
    )
  }
)

Button.displayName = 'Button'
