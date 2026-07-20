import type { ButtonHTMLAttributes } from 'react'

type ButtonVariant = 'primary' | 'secondary'

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant
}

const variantStyles: Record<ButtonVariant, string> = {
  primary:
    'rounded-lg bg-brand-orange px-4 py-2 text-sm font-medium text-white hover:bg-orange-600 transition-all duration-200 hover:scale-105 active:scale-95 disabled:opacity-50',
  secondary:
    'rounded-lg border border-brand-medium/50 bg-brand-dark-alt px-4 py-2 text-sm font-medium text-brand-cream hover:bg-brand-medium/30 transition-all duration-200 hover:scale-105 active:scale-95 disabled:opacity-50',
}

export function Button({
  variant = 'primary',
  className = '',
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      className={`${variantStyles[variant]} ${className}`.trim()}
      {...props}
    >
      {children}
    </button>
  )
}
