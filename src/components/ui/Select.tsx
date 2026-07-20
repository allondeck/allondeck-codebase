import type { SelectHTMLAttributes } from 'react'

type SelectProps = SelectHTMLAttributes<HTMLSelectElement> & {
  /** Optional label for accessibility */
  'aria-label'?: string
}

const baseStyles =
  'w-full min-w-0 appearance-none rounded-lg border border-brand-medium/60 bg-brand-dark pl-4 pr-12 py-2 text-sm text-white focus:border-brand-orange focus:outline-none focus:ring-1 focus:ring-brand-orange'

/** Chevron icon via inline SVG - positioned with 1rem from right edge for spacing */
const chevronSvg = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%23f6ebd4'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'/%3E%3C/svg%3E")`

export function Select({ className = '', style, ...props }: SelectProps) {
  return (
    <select
      className={`${baseStyles} ${className}`.trim()}
      style={{
        backgroundImage: chevronSvg,
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'right 1rem center',
        backgroundSize: '1.25rem 1.25rem',
        ...style,
      }}
      {...props}
    />
  )
}
