'use client'
import { useRef, useCallback, useEffect, useState } from 'react'

interface Props {
    min: number
    max: number
    value: [number, number]
    onChange: (value: [number, number]) => void
    label?: string
}

export default function PriceRangeSlider({ min, max, value, onChange, label = '6 mdr.' }: Props) {
    const [lo, hi] = value
    const range = max - min || 1
    const trackRef = useRef<HTMLDivElement>(null)
    const valueRef = useRef(value)
    const dropdownRef = useRef<HTMLDivElement>(null)
    const [open, setOpen] = useState(false)

    useEffect(() => { valueRef.current = value }, [value])

    // close on outside click
    useEffect(() => {
        const handler = (e: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) setOpen(false)
        }
        document.addEventListener('mousedown', handler)
        return () => document.removeEventListener('mousedown', handler)
    }, [])

    const toPercent = (v: number) => ((v - min) / range) * 100
    const loPercent = toPercent(lo)
    const hiPercent = toPercent(hi)

    const getVal = useCallback((clientX: number) => {
        const rect = trackRef.current?.getBoundingClientRect()
        if (!rect) return 0
        return Math.round(min + Math.max(0, Math.min(1, (clientX - rect.left) / rect.width)) * range)
    }, [min, range])

    const startDrag = useCallback((thumb: 'lo' | 'hi') => (e: React.PointerEvent) => {
        e.currentTarget.setPointerCapture(e.pointerId)
        const onMove = (ev: PointerEvent) => {
            const v = getVal(ev.clientX)
            const [l, h] = valueRef.current
            onChange(thumb === 'lo' ? [Math.min(v, h - 1), h] : [l, Math.max(v, l + 1)])
        }
        const onUp = () => {
            window.removeEventListener('pointermove', onMove)
            window.removeEventListener('pointerup', onUp)
        }
        window.addEventListener('pointermove', onMove)
        window.addEventListener('pointerup', onUp)
    }, [onChange, getVal])

    const fmt = (n: number) => n.toLocaleString('da-DK')
    const isFiltered = lo > min || hi < max

    return (
        <div ref={dropdownRef} className="relative">
            <button
                onClick={() => setOpen(v => !v)}
                className={`flex items-center gap-2 px-4 py-2 rounded-md border text-sm transition-colors cursor-pointer ${
                    isFiltered
                        ? 'bg-[#2a3340] border-[#4a90b8] text-[#cdd6e0]'
                        : 'bg-[#2a3340] border-[#334155] text-[#cdd6e0] hover:border-[#4a90b8]'
                }`}
            >
                <span>
                    {isFiltered ? `${fmt(lo)} – ${fmt(hi)} kr` : `Pris (${label})`}
                </span>
                <svg
                    className={`w-3 h-3 text-[#7d8fa0] transition-transform ${open ? 'rotate-180' : ''}`}
                    fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}
                >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
            </button>

            {open && (
                <div className="absolute top-full mt-1 left-0 z-50 bg-[#2a3340] border border-[#334155] rounded-md shadow-lg p-4 min-w-65">
                    <div className="flex items-center justify-between mb-3">
                        <span className="text-xs text-[#7d8fa0]">Mindstepris ({label})</span>
                        <span className="text-xs text-[#cdd6e0] bg-[#1a1f27] px-2 py-0.5 rounded-full border border-[#334155]">
                            {fmt(lo)} – {fmt(hi)} kr
                        </span>
                    </div>
                    <div ref={trackRef} className="relative h-1.5 rounded-full bg-[#334155]">
                        <div
                            className="absolute h-full rounded-full bg-[#4a90b8]"
                            style={{ left: `${loPercent}%`, width: `${hiPercent - loPercent}%` }}
                        />
                        {(['lo', 'hi'] as const).map(thumb => (
                            <div
                                key={thumb}
                                onPointerDown={startDrag(thumb)}
                                className="absolute top-1/2 w-4 h-4 -translate-y-1/2 rounded-full bg-[#4a90b8] border-2 border-[#20262f] cursor-grab active:cursor-grabbing shadow-md hover:scale-110 transition-transform"
                                style={{
                                    left: `calc(${thumb === 'lo' ? loPercent : hiPercent}% - 8px)`,
                                    zIndex: thumb === 'hi' ? 4 : 3,
                                    touchAction: 'none',
                                }}
                            />
                        ))}
                    </div>
                </div>
            )}
        </div>
    )
}
