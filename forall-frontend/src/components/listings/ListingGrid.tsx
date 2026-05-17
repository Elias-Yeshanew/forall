'use client'
// src/components/listings/ListingGrid.tsx
import { Listing } from '@/types/listing'
import { ListingCard } from './ListingCard'
import { Loader2, SearchX } from 'lucide-react'

interface ListingGridProps {
  listings: Listing[]
  isLoading?: boolean
  emptyMessage?: string
}

export function ListingGrid({ listings, isLoading, emptyMessage = 'No listings found.' }: ListingGridProps) {
  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-24">
        <Loader2 className="w-8 h-8 animate-spin text-[#C9A84C]" />
      </div>
    )
  }

  if (!listings.length) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-[#8A8070] gap-3">
        <SearchX className="w-12 h-12 opacity-40" />
        <p className="text-sm">{emptyMessage}</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
      {listings.map((listing) => (
        <ListingCard key={listing.id} listing={listing} />
      ))}
    </div>
  )
}
