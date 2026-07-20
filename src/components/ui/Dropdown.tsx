import { useState, useRef, useEffect } from 'react'

type DropdownItem = {
  label: string
  onClick: () => void
}

type DropdownProps = {
  trigger: React.ReactNode
  items: DropdownItem[]
  align?: 'left' | 'right'
  /** Use primary (dark) or secondary (outlined) button style for trigger */
  variant?: 'primary' | 'secondary'
}

const triggerStyles = {
  primary: 'rounded-lg bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-800',
  secondary:
    'rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50',
}

export function Dropdown({ trigger, items, align = 'right', variant = 'primary' }: DropdownProps) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    if (open) {
      document.addEventListener('click', handleClickOutside)
      return () => document.removeEventListener('click', handleClickOutside)
    }
  }, [open])

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className={`inline-flex items-center ${triggerStyles[variant]}`}
      >
        {trigger}
      </button>
      {open && (
        <div
          className={`absolute top-full z-20 mt-1 min-w-48 rounded-lg border border-gray-200 bg-white py-1 shadow-lg ${
            align === 'right' ? 'right-0' : 'left-0'
          }`}
        >
          {items.map((item, i) => (
            <button
              key={i}
              type="button"
              onClick={() => {
                item.onClick()
                setOpen(false)
              }}
              className="block w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50"
            >
              {item.label}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
