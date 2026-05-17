'use client'
// src/app/(public)/listings/page.tsx
import { useState } from 'react'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { FilterBar } from '@/components/listings/FilterBar'
import { ListingGrid } from '@/components/listings/ListingGrid'
import { useListings } from '@/hooks/useListings'
import { ListingFilters } from '@/types/listing'
import { useTranslation } from 'react-i18next'

export default function ListingsPage() {
  const { t } = useTranslation('listings')
  const [filters, setFilters] = useState<ListingFilters>({ page: 1, limit: 12 })
  const { data, isLoading } = useListings(filters)

  const handlePageChange = (page: number) => setFilters((f) => ({ ...f, page }))

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <FilterBar filters={filters} onChange={setFilters} />

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 py-8">
        <div className="section-title mb-6">
          {t('allListings', 'All Listings')}
          {data && (
            <span className="text-xs text-[#8A8070] font-normal ml-2 normal-case">
              {t('totalListings', '({{total}} total)', { total: data.total })}
            </span>
          )}
        </div>

        <ListingGrid
          listings={data?.data ?? []}
          isLoading={isLoading}
          emptyMessage={t('emptyMessage', 'No listings found. Try adjusting your filters.')}
        />

        {/* Pagination */}
        {data && data.totalPages > 1 && (
          <div className="flex items-center justify-center gap-2 mt-12">
            <button
              disabled={filters.page === 1}
              onClick={() => handlePageChange((filters.page ?? 1) - 1)}
              className="text-sm px-4 py-2 border border-[#C9A84C]/20 rounded text-[#8A8070] hover:text-[#C9A84C] disabled:opacity-30 transition-colors"
            >
              {t('previous', '← Previous')}
            </button>
            <span className="text-xs text-[#8A8070] px-4">
              {t('pageOf', 'Page {{page}} of {{totalPages}}', { page: filters.page, totalPages: data.totalPages })}
            </span>
            <button
              disabled={filters.page === data.totalPages}
              onClick={() => handlePageChange((filters.page ?? 1) + 1)}
              className="text-sm px-4 py-2 border border-[#C9A84C]/20 rounded text-[#8A8070] hover:text-[#C9A84C] disabled:opacity-30 transition-colors"
            >
              {t('next', 'Next →')}
            </button>
          </div>
        )}
      </main>

      <Footer />
    </div>
  )
}
