'use client'

import { useState, useRef, useEffect } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'

type Props = {
  value: string // YYYY-MM-DD or ''
  onChange: (value: string) => void
  placeholder?: string
}

const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December']
const DAY_HEADERS = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa']

export default function DatePicker({ value, onChange, placeholder = 'Pick a date…' }: Props) {
  const today = new Date()

  const [open, setOpen] = useState(false)
  const [viewYear, setViewYear] = useState(() => value ? parseInt(value.slice(0, 4)) : today.getFullYear())
  const [viewMonth, setViewMonth] = useState(() => value ? parseInt(value.slice(5, 7)) - 1 : today.getMonth())
  const [yearInput, setYearInput] = useState(() => value ? value.slice(0, 4) : String(today.getFullYear()))

  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return
    function handler(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [open])

  // Sync viewYear/yearInput when value changes externally
  useEffect(() => {
    if (value) {
      setViewYear(parseInt(value.slice(0, 4)))
      setViewMonth(parseInt(value.slice(5, 7)) - 1)
      setYearInput(value.slice(0, 4))
    }
  }, [value])

  const selectedYear = value ? parseInt(value.slice(0, 4)) : null
  const selectedMonth = value ? parseInt(value.slice(5, 7)) - 1 : null
  const selectedDay = value ? parseInt(value.slice(8, 10)) : null

  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate()
  const firstDayOfWeek = new Date(viewYear, viewMonth, 1).getDay()

  function selectDay(day: number) {
    const m = String(viewMonth + 1).padStart(2, '0')
    const d = String(day).padStart(2, '0')
    onChange(`${viewYear}-${m}-${d}`)
    setOpen(false)
  }

  function prevMonth() {
    if (viewMonth === 0) {
      setViewMonth(11)
      setViewYear(y => { setYearInput(String(y - 1)); return y - 1 })
    } else {
      setViewMonth(m => m - 1)
    }
  }

  function nextMonth() {
    if (viewMonth === 11) {
      setViewMonth(0)
      setViewYear(y => { setYearInput(String(y + 1)); return y + 1 })
    } else {
      setViewMonth(m => m + 1)
    }
  }

  function handleYearInput(raw: string) {
    setYearInput(raw)
    const n = parseInt(raw)
    if (raw.length === 4 && !isNaN(n) && n >= 1000 && n <= 9999) {
      setViewYear(n)
    }
  }

  const displayValue = value
    ? new Date(value + 'T12:00:00').toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
    : ''

  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen(o => !o)}
        className="w-full border border-gray-300 rounded px-3 py-2 text-sm text-left focus:outline-none focus:ring-2 focus:ring-slate-400 bg-white"
      >
        {displayValue || <span className="text-gray-400">{placeholder}</span>}
      </button>

      {open && (
        <div className="absolute z-50 mt-1 bg-white border border-gray-200 rounded-lg shadow-xl p-3 w-64">
          {/* Month / Year navigation */}
          <div className="flex items-center gap-1 mb-3">
            <button
              type="button"
              onClick={prevMonth}
              className="p-1 rounded hover:bg-gray-100 text-slate-600"
            >
              <ChevronLeft size={14} />
            </button>

            <select
              value={viewMonth}
              onChange={e => setViewMonth(parseInt(e.target.value))}
              className="flex-1 text-sm border border-gray-200 rounded px-1 py-0.5 focus:outline-none focus:ring-1 focus:ring-slate-400"
            >
              {MONTHS.map((m, i) => <option key={i} value={i}>{m}</option>)}
            </select>

            <input
              type="text"
              value={yearInput}
              onChange={e => handleYearInput(e.target.value)}
              className="w-14 text-sm border border-gray-200 rounded px-1 py-0.5 text-center focus:outline-none focus:ring-1 focus:ring-slate-400"
              maxLength={4}
            />

            <button
              type="button"
              onClick={nextMonth}
              className="p-1 rounded hover:bg-gray-100 text-slate-600"
            >
              <ChevronRight size={14} />
            </button>
          </div>

          {/* Day grid */}
          <div className="grid grid-cols-7 gap-0.5 text-center">
            {DAY_HEADERS.map(d => (
              <div key={d} className="text-xs text-gray-400 py-1 font-medium">{d}</div>
            ))}
            {Array.from({ length: firstDayOfWeek }).map((_, i) => (
              <div key={`blank-${i}`} />
            ))}
            {Array.from({ length: daysInMonth }).map((_, i) => {
              const day = i + 1
              const isSelected = day === selectedDay && viewMonth === selectedMonth && viewYear === selectedYear
              return (
                <button
                  key={day}
                  type="button"
                  onClick={() => selectDay(day)}
                  className={`text-xs rounded py-1.5 transition-colors ${
                    isSelected
                      ? 'bg-slate-700 text-white'
                      : 'hover:bg-slate-100 text-slate-700'
                  }`}
                >
                  {day}
                </button>
              )
            })}
          </div>

          {value && (
            <button
              type="button"
              onClick={() => { onChange(''); setOpen(false) }}
              className="mt-2 w-full text-xs text-slate-400 hover:text-red-500 transition-colors"
            >
              Clear date
            </button>
          )}
        </div>
      )}
    </div>
  )
}
