import { useCallback, useId } from 'react'
import { formatPrice } from "../../lib/utils"

type PriceRangeSliderProps = {
  min: number
  max: number
  valueMin: number
  valueMax: number
  onChange: (min: number, max: number) => void
  step?: number
  className?: string
  'aria-label'?: string
}

/** Dual-thumb price range slider. Min/max are the data bounds; valueMin/valueMax are the selected range. */
export function PriceRangeSlider({
  min,
  max,
  valueMin,
  valueMax,
  onChange,
  step = 1,
  className = '',
  'aria-label': ariaLabel = 'Price range',
}: PriceRangeSliderProps) {
  const idLow = useId()
  const idHigh = useId()
  const range = max - min || 1
  const percentLow = ((valueMin - min) / range) * 100
  const percentHigh = ((valueMax - min) / range) * 100

  const clamp = useCallback(
    (v: number) => Math.min(max, Math.max(min, v)),
    [min, max]
  )

  const handleLow = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const v = clamp(Number(e.target.value))
      onChange(v, Math.max(v, valueMax))
    },
    [clamp, valueMax, onChange]
  )

  const handleHigh = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const v = clamp(Number(e.target.value))
      onChange(Math.min(v, valueMin), v)
    },
    [clamp, valueMin, onChange]
  )

  return (
    <div
      className={className}
      role="group"
      aria-label={ariaLabel}
    >
      <div className="flex items-center justify-start gap-1.5 text-left text-sm text-brand-light">
        <span>{formatPrice(valueMin)}</span>
        <span>–</span>
        <span>{formatPrice(valueMax)}</span>
      </div>
      <div className="relative mt-2 h-8 w-full">
        {/* Filled track segment between thumbs */}
        <div
          className="absolute top-1/2 h-1.5 -translate-y-1/2 rounded-full bg-brand-medium/35"
          style={{ left: 0, right: 0 }}
        />
        <div
          className="absolute top-1/2 h-1.5 -translate-y-1/2 rounded-full bg-brand-orange transition-[left,right]"
          style={{ left: `${percentLow}%`, right: `${100 - percentHigh}%` }}
        />
        <input
          id={idLow}
          type="range"
          min={min}
          max={max}
          step={step}
          value={valueMin}
          onChange={handleLow}
          className="absolute inset-0 h-full w-full cursor-pointer appearance-none bg-transparent [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:relative [&::-webkit-slider-thumb]:z-10 [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-brand-orange [&::-webkit-slider-thumb]:bg-brand-cream [&::-webkit-slider-thumb]:shadow [&::-webkit-slider-thumb]:transition-transform hover:[&::-webkit-slider-thumb]:scale-110 [&::-moz-range-thumb]:h-5 [&::-moz-range-thumb]:w-5 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-brand-orange [&::-moz-range-thumb]:bg-brand-cream [&::-moz-range-thumb]:shadow"
          aria-label="Minimum price"
        />
        <input
          id={idHigh}
          type="range"
          min={min}
          max={max}
          step={step}
          value={valueMax}
          onChange={handleHigh}
          className="absolute inset-0 h-full w-full cursor-pointer appearance-none bg-transparent [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:relative [&::-webkit-slider-thumb]:z-10 [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-brand-orange [&::-webkit-slider-thumb]:bg-brand-cream [&::-webkit-slider-thumb]:shadow [&::-webkit-slider-thumb]:transition-transform hover:[&::-webkit-slider-thumb]:scale-110 [&::-moz-range-thumb]:h-5 [&::-moz-range-thumb]:w-5 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-brand-orange [&::-moz-range-thumb]:bg-brand-cream [&::-moz-range-thumb]:shadow"
          aria-label="Maximum price"
        />
      </div>
    </div>
  )
}
