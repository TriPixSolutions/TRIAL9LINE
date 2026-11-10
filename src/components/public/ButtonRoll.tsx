import React from 'react'
import Link from 'next/link'

interface ButtonRollProps {
  href?: string
  onClick?: () => void
  type?: 'button' | 'submit' | 'reset'
  variant?: 'primary' | 'secondary' | 'dark' | 'white'
  size?: 'sm' | 'md' | 'lg'
  children: string
  showArrow?: boolean
  className?: string
  disabled?: boolean
}

export function ButtonRoll({
  href,
  onClick,
  type = 'button',
  variant = 'primary',
  size = 'md',
  children,
  showArrow = true,
  className = '',
  disabled = false,
}: ButtonRollProps) {
  // Variant styles
  const variantStyles = {
    primary: 'bg-primary text-white hover:bg-primary-deep shadow-md',
    secondary: 'bg-white/10 text-white border border-white/20 hover:bg-white/20',
    dark: 'bg-[#1a153f] text-white hover:bg-[#2d0744] shadow-sm',
    white: 'bg-white text-primary hover:bg-white/95 shadow-lg',
  }[variant]

  // Size styles
  const sizeStyles = {
    sm: 'text-xs px-5 py-2.5 min-h-[38px]',
    md: 'text-sm px-7 py-3 min-h-[44px]',
    lg: 'text-sm sm:text-base px-8 py-3.5 min-h-[48px]',
  }[size]

  const baseClasses = `btn-roll group font-sans font-semibold tracking-wide uppercase ${variantStyles} ${sizeStyles} ${className} ${
    disabled ? 'opacity-50 pointer-events-none' : ''
  }`

  const content = (
    <>
      {/* Accessible screen reader announcement */}
      <span className="sr-only">{children}</span>

      {/* Clipped duplicate visual roll layers */}
      <span aria-hidden="true" className="btn-roll-inner">
        <span className="btn-roll-primary">{children}</span>
        <span className="btn-roll-clone">{children}</span>
      </span>

      {showArrow && (
        <span
          aria-hidden="true"
          className="ml-2 inline-block transition-transform duration-300 ease-out group-hover:translate-x-0.5 group-hover:-translate-y-0.5 text-xs sm:text-sm"
        >
          ↗
        </span>
      )}
    </>
  )

  if (href) {
    return (
      <Link href={href} className={baseClasses}>
        {content}
      </Link>
    )
  }

  return (
    <button type={type} onClick={onClick} disabled={disabled} className={baseClasses}>
      {content}
    </button>
  )
}
