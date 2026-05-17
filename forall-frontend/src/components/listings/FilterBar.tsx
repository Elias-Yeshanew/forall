'use client'
// src/components/listings/FilterBar.tsx
import { useState, useCallback } from 'react'
import { Search, SlidersHorizontal, X } from 'lucide-react'
import { ListingFilters, ListingType } from '@/types/listing'
import { cn } from '@/lib/utils'
import { useTranslation } from 'react-i18next'

export interface FilterBarProps {
  filters: ListingFilters
  onChange: (filters: ListingFilters) => void
}

export function FilterBar({ filters, onChange }: FilterBarProps) {
  const { t } = useTranslation('listings')
  const [search, setSearch] = useState(filters.search ?? '')
  const [showAdvanced, setShowAdvanced] = useState(false)

  const TYPE_FILTERS: { value: ListingType | 'all'; label: string }[] = [
    { value: 'all', label: t('filterAll', 'All') },
    { value: 'car', label: t('filterCars', 'Cars') },
    { value: 'house', label: t('filterHouses', 'Houses') },
  ]

  const handleTypeChange = useCallback(
    (type: ListingType | 'all') => {
      onChange({ ...filters, type: type === 'all' ? undefined : type, page: 1 })
    },
    [filters, onChange]
  )

  const handleSearchSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault()
      onChange({ ...filters, search, page: 1 })
    },
    [filters, search, onChange]
  )

  const clearSearch = () => {
    setSearch('')
    onChange({ ...filters, search: undefined, page: 1 })
  }

  const activeType = filters.type ?? 'all'

  return (
    <div className="bg-[#111] border-b border-[#C9A84C]/15 sticky top-16 z-30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex flex-wrap gap-3 items-center">
        {/* Type filters */}
        <div className="flex gap-1">
          {TYPE_FILTERS.map((f) => (
            <button
              key={f.value}
              onClick={() => handleTypeChange(f.value as ListingType | 'all')}
              className={cn(
                'text-xs px-4 py-2 rounded-full border transition-all duration-200',
                activeType === f.value
                  ? 'border-[#C9A84C] text-[#C9A84C] bg-[#C9A84C]/10'
                  : 'border-[#C9A84C]/20 text-[#8A8070] hover:border-[#C9A84C]/40 hover:text-[#C8C0B0]'
              )}
            >
              {f.label}
            </button>
          ))}
        </div>

        {/* Search */}
        <form onSubmit={handleSearchSubmit} className="flex-1 min-w-[200px] max-w-sm relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#8A8070]" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={t('searchPlaceholder', 'Search listings...')}
            className="input-base pl-9 pr-8 py-2 text-xs"
          />
          {search && (
            <button
              type="button"
              onClick={clearSearch}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-[#8A8070] hover:text-[#C8C0B0]"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </form>

        {/* Advanced toggle */}
        <button
          onClick={() => setShowAdvanced(!showAdvanced)}
          className={cn(
            'flex items-center gap-1.5 text-xs px-3 py-2 rounded border transition-all',
            showAdvanced
              ? 'border-[#C9A84C]/40 text-[#C9A84C] bg-[#C9A84C]/10'
              : 'border-[#C9A84C]/20 text-[#8A8070] hover:text-[#C8C0B0]'
          )}
        >
          <SlidersHorizontal className="w-3.5 h-3.5" />
          {t('filterBtn', 'Filter')}
        </button>
      </div>

      {/* Advanced filters */}
      {showAdvanced && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 pb-4 flex flex-wrap gap-4 items-end">
          <div className="flex flex-col gap-1">
            <label className="label-base">{t('minPrice', 'Min Price (ETB)')}</label>
            <input
              type="number"
              className="input-base w-36 py-1.5 text-xs"
              placeholder="0"
              value={filters.minPrice ?? ''}
              onChange={(e) => onChange({ ...filters, minPrice: e.target.value ? Number(e.target.value) : undefined })}
            />
          </div>
          <div className="flex flex-col gap-1">
            <label className="label-base">{t('maxPrice', 'Max Price (ETB)')}</label>
            <input
              type="number"
              className="input-base w-36 py-1.5 text-xs"
              placeholder="Any"
              value={filters.maxPrice ?? ''}
              onChange={(e) => onChange({ ...filters, maxPrice: e.target.value ? Number(e.target.value) : undefined })}
            />
          </div>
          <div className="flex flex-col gap-1">
            <label className="label-base">{t('city', 'City')}</label>
            <input
              type="text"
              className="input-base w-40 py-1.5 text-xs"
              placeholder="Addis Ababa..."
              value={filters.city ?? ''}
              onChange={(e) => onChange({ ...filters, city: e.target.value || undefined })}
            />
          </div>
          <button
            onClick={() => onChange({ page: 1 })}
            className="text-xs text-red-400 hover:text-red-300 underline"
          >
            {t('clearAll', 'Clear all')}
          </button>
        </div>
      )}
    </div>
  )
}
