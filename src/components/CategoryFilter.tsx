'use client'
import { useState, useRef, useEffect } from 'react'
import { CATEGORIES, CATEGORY_LABELS } from '@/lib/offers'

interface CategoryFilterProps {
    selected: string[]
    onChange: (categories: string[]) => void
}

export default function CategoryFilter({ selected = [], onChange }: CategoryFilterProps) {
    const [open, setOpen] = useState(false)
    const ref = useRef<HTMLDivElement>(null)
    const allSelected = selected.length === CATEGORIES.length

    const toggleAll = () => onChange(allSelected ? [] : [...CATEGORIES])
    const toggleOne = (cat: string) => {
        if (selected.includes(cat)) {
            onChange(selected.filter(c => c !== cat))
        } else {
            onChange([...selected, cat])
        }
    }

    // close on outside click
    useEffect(() => {
        const handler = (e: MouseEvent) => {
            if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
        }
        document.addEventListener('mousedown', handler)
        return () => document.removeEventListener('mousedown', handler)
    }, [])

    const label = allSelected
        ? 'Alle kategorier'
        : selected.length === 0
            ? 'Ingen kategorier'
            : selected.length === 1
                ? CATEGORY_LABELS[selected[0] as keyof typeof CATEGORY_LABELS] ?? selected[0]
                : `${selected.length} kategorier`

    return (
        <div ref={ref} className="relative">
            <button
                onClick={() => setOpen(v => !v)}
                className="flex items-center gap-2 px-4 py-2 rounded-md border border-[#334155] bg-[#2a3340] text-[#cdd6e0] text-sm hover:border-[#4a90b8] transition-colors cursor-pointer"
            >
                <span>{label}</span>
                <svg
                    className={`w-3 h-3 text-[#7d8fa0] transition-transform ${open ? 'rotate-180' : ''}`}
                    fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}
                >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
            </button>

            {open && (
                <div className="absolute top-full mt-1 left-0 z-50 min-w-42.5 bg-[#2a3340] border border-[#334155] rounded-md shadow-lg py-1">
                    <button
                        onClick={toggleAll}
                        className="w-full flex items-center gap-2 px-3 py-2 text-sm text-[#cdd6e0] hover:bg-[#334155] transition-colors cursor-pointer"
                    >
                        <span className={`w-4 h-4 rounded border flex items-center justify-center shrink-0 ${allSelected ? 'bg-[#4a90b8] border-[#4a90b8]' : 'border-[#7d8fa0]'}`}>
                            {allSelected && <svg className="w-2.5 h-2.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>}
                        </span>
                        Alle
                    </button>
                    <div className="border-t border-[#334155] my-1" />
                    {CATEGORIES.map(cat => {
                        const checked = selected.includes(cat)
                        return (
                            <button
                                key={cat}
                                onClick={() => toggleOne(cat)}
                                className="w-full flex items-center gap-2 px-3 py-2 text-sm text-[#cdd6e0] hover:bg-[#334155] transition-colors cursor-pointer"
                            >
                                <span className={`w-4 h-4 rounded border flex items-center justify-center shrink-0 ${checked ? 'bg-[#4a90b8] border-[#4a90b8]' : 'border-[#7d8fa0]'}`}>
                                    {checked && <svg className="w-2.5 h-2.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>}
                                </span>
                                {CATEGORY_LABELS[cat as keyof typeof CATEGORY_LABELS] ?? cat}
                            </button>
                        )
                    })}
                </div>
            )}
        </div>
    )
}

