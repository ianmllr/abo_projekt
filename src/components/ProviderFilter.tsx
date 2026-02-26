import { PROVIDERS } from '@/lib/offers'

interface ProviderFilterProps {
    selected: string[]
    onChange: (providers: string[]) => void
}

export default function ProviderFilter({ selected, onChange }: ProviderFilterProps) {
    const allSelected = selected.length === PROVIDERS.length

    const toggleAll = () => {
        onChange(allSelected ? [] : [...PROVIDERS])
    }

    const toggleOne = (provider: string) => {
        if (selected.includes(provider)) {
            onChange(selected.filter(p => p !== provider))
        } else {
            onChange([...selected, provider])
        }
    }

    return (
        <div className="flex gap-2 flex-wrap">
            <button
                onClick={toggleAll}
                className={`px-4 py-2 rounded-md border text-sm cursor-pointer transition-colors
                    ${allSelected
                        ? 'bg-[#ededed] border-[#ededed] text-black'
                        : 'bg-[#1a1a1a] border-gray-600 text-gray-400 hover:border-gray-400'}`}
            >
                Alle
            </button>
            {PROVIDERS.map(p => (
                <button
                    key={p}
                    onClick={() => toggleOne(p)}
                    className={`px-4 py-2 rounded-md border text-sm cursor-pointer transition-colors
                        ${selected.includes(p)
                            ? 'bg-[#ededed] border-[#ededed] text-black'
                            : 'bg-[#1a1a1a] border-gray-600 text-gray-400 hover:border-gray-400'}`}
                >
                    {p}
                </button>
            ))}
        </div>
    )
}
