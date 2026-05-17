'use client'
// src/components/listings/ListingCard.tsx
import { useState } from 'react'
import { MapPin, Calendar, Gauge, BedDouble, Maximize2, Phone } from 'lucide-react'
import { Listing } from '@/types/listing'
import { formatPrice } from '@/lib/utils'
import { Badge } from '@/components/ui/Badge'
import { useAuth } from '@/context/AuthContext'
import { ContactModal } from '@/components/forms/ContactModal'
import Link from 'next/link'
import { useTranslation } from 'react-i18next'

interface ListingCardProps {
  listing: Listing
}

const TYPE_ICON: Record<string, string> = {
  car: '🚗',
  house: '🏡',
}

export function ListingCard({ listing }: ListingCardProps) {
  const { t } = useTranslation(['listings', 'common'])
  const { user } = useAuth()
  const isStaff = user?.role === 'admin' || user?.role === 'sales'
  const [contactOpen, setContactOpen] = useState(false)

  const metaTags = listing.type === 'car'
    ? [
        listing.carDetails?.year && { icon: <Calendar className="w-3 h-3" />, label: String(listing.carDetails.year) },
        listing.carDetails?.mileage && { icon: <Gauge className="w-3 h-3" />, label: `${listing.carDetails.mileage.toLocaleString()} km` },
        listing.carDetails?.transmission && { icon: null, label: listing.carDetails.transmission },
      ].filter(Boolean)
    : [
        listing.houseDetails?.bedrooms !== undefined && { icon: <BedDouble className="w-3 h-3" />, label: `${listing.houseDetails.bedrooms} bed` },
        listing.houseDetails?.areaSqm && { icon: <Maximize2 className="w-3 h-3" />, label: `${listing.houseDetails.areaSqm} m²` },
        listing.houseDetails?.saleType && { icon: null, label: listing.houseDetails.saleType === 'for_sale' ? 'For Sale' : 'For Rent' },
      ].filter(Boolean)

  return (
    <>
      <div className="card-base flex flex-col group">
        {/* Image */}
        <Link href={`/listings/${listing.id}`} className="block">
          <div className="relative h-48 bg-[#111] flex items-center justify-center overflow-hidden">
            {listing.images?.[0] ? (
              <img
                src={listing.images[0]}
                alt={listing.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
            ) : (
              <span className="text-5xl opacity-60">{TYPE_ICON[listing.type]}</span>
            )}
            <div className="absolute top-3 left-3">
              <Badge variant={listing.type as 'car' | 'house'}>
                {listing.type === 'car' ? t('common:car', 'Car') : t('common:house', 'House')}
              </Badge>
            </div>
            {isStaff && (
              <div className="absolute top-3 right-3">
                <Badge variant={listing.status as 'active' | 'pending' | 'sold'}>
                  {listing.status}
                </Badge>
              </div>
            )}
          </div>
        </Link>

        {/* Body */}
        <div className="p-4 flex flex-col flex-1">
          <Link href={`/listings/${listing.id}`}>
            <h3 className="font-['Playfair_Display'] font-semibold text-[#F5F0E8] text-base mb-1 hover:text-[#C9A84C] transition-colors line-clamp-1">
              {listing.title}
            </h3>
          </Link>

          <div className="flex items-center gap-1 text-xs text-[#8A8070] mb-2">
            <MapPin className="w-3 h-3 flex-shrink-0" />
            <span className="truncate">{listing.location}</span>
          </div>

          <div className="text-lg font-semibold text-[#C9A84C] mb-3">
            ETB {formatPrice(listing.price)}
          </div>

          {/* Meta tags */}
          <div className="flex flex-wrap gap-1.5 mb-4">
            {(metaTags as { icon: React.ReactNode; label: string }[]).map((tag, i) => (
              <span
                key={i}
                className="flex items-center gap-1 bg-[#222] border border-[#C9A84C]/15 text-[#C8C0B0] text-xs px-2 py-0.5 rounded"
              >
                {tag.icon}
                {tag.label}
              </span>
            ))}
          </div>

          {/* Footer */}
          <div className="mt-auto pt-3 border-t border-[#C9A84C]/10 flex items-center justify-between">
            {isStaff && listing.poster ? (
              <div className="flex items-center gap-1 text-xs text-[#8A8070]">
                <Phone className="w-3 h-3" />
                <span>{listing.poster.phone}</span>
              </div>
            ) : (
              <span className="text-xs text-[#8A8070]">{t('listings:listedByForall', 'Listed by Forall')}</span>
            )}

            {!isStaff && (
              <button
                onClick={() => setContactOpen(true)}
                className="text-xs text-[#C9A84C] border border-[#C9A84C]/30 px-3 py-1.5 rounded hover:bg-[#C9A84C]/10 transition-colors"
              >
                {t('listings:contactSales', 'Contact Sales')}
              </button>
            )}
          </div>
        </div>
      </div>

      <ContactModal
        open={contactOpen}
        onClose={() => setContactOpen(false)}
        listing={listing}
      />
    </>
  )
}
