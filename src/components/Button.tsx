import type { ButtonHTMLAttributes } from 'react'

type ButtonVariant = 'primary' | 'secondary'

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant
}

const variantStyles: Record<ButtonVariant, string> = {
  primary:
    'rounded-lg bg-[#e38622] px-4 py-2 text-sm font-medium text-white hover:bg-orange-600 transition-all duration-200 hover:scale-105 active:scale-95 disabled:opacity-50',
  secondary:
    'rounded-lg border border-[#066175]/50 bg-[#052631] px-4 py-2 text-sm font-medium text-[#f6ebd4] hover:bg-[#066175]/30 transition-all duration-200 hover:scale-105 active:scale-95 disabled:opacity-50',
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
