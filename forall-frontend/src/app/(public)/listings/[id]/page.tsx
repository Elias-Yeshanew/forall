'use client'
// src/app/(public)/listings/[id]/page.tsx
import { useState } from 'react'
import { useParams } from 'next/navigation'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { ContactModal } from '@/components/forms/ContactModal'
import { useListing } from '@/hooks/useListings'
import { useAuth } from '@/context/AuthContext'
import { formatPrice, formatDate } from '@/lib/utils'
import { MapPin, Calendar, Gauge, BedDouble, Maximize2, Phone, Mail, Loader2, ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { useTranslation } from 'react-i18next'

export default function ListingDetailPage() {
  const { t } = useTranslation(['listingDetail', 'common', 'listing'])
  const { id } = useParams<{ id: string }>()
  const { data: listing, isLoading } = useListing(id)
  const { user } = useAuth()
  const isStaff = user?.role === 'admin' || user?.role === 'sales'
  const [contactOpen, setContactOpen] = useState(false)
  const [activeImage, setActiveImage] = useState(0)

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-[#C9A84C]" />
        </div>
      </div>
    )
  }

  if (!listing) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-1 flex flex-col items-center justify-center gap-4">
          <p className="text-[#8A8070]">{t('listingDetail:listingNotFound', 'Listing not found.')}</p>
          <Link href="/listings" className="btn-outline text-sm">{t('listingDetail:backToListings', 'Back to Listings')}</Link>
        </div>
      </div>
    )
  }

  const isCar = listing.type === 'car'
  const images = listing.images?.length ? listing.images : []

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-6xl mx-auto w-full px-4 sm:px-6 py-8">
        {/* Breadcrumb */}
        <Link href="/listings" className="inline-flex items-center gap-1.5 text-xs text-[#8A8070] hover:text-[#C9A84C] transition-colors mb-6">
          <ArrowLeft className="w-3.5 h-3.5" />
          {t('listingDetail:backToListings', 'Back to Listings')}
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left: images + details */}
          <div className="lg:col-span-2 flex flex-col gap-6">
            {/* Image gallery */}
            <div className="bg-[#111] rounded-xl overflow-hidden border border-[#C9A84C]/15">
              <div className="relative h-72 sm:h-96 flex items-center justify-center">
                {images[activeImage] ? (
                  <img src={images[activeImage]} alt={listing.title} className="w-full h-full object-cover" />
                ) : (
                  <span className="text-8xl opacity-40">{isCar ? '🚗' : '🏡'}</span>
                )}
                <div className="absolute top-4 left-4 flex gap-2">
                  <Badge variant={listing.type as 'car' | 'house'}>
                    {listing.type === 'car' ? t('common:car', 'Car') : t('common:house', 'House')}
                  </Badge>
                  <Badge variant={listing.status as 'active' | 'pending' | 'sold'}>
                    {listing.status}
                  </Badge>
                </div>
              </div>
              {images.length > 1 && (
                <div className="flex gap-2 p-3 overflow-x-auto">
                  {images.map((img, i) => (
                    <button
                      key={i}
                      onClick={() => setActiveImage(i)}
                      className={`flex-shrink-0 w-16 h-16 rounded-md overflow-hidden border-2 transition-all ${i === activeImage ? 'border-[#C9A84C]' : 'border-transparent opacity-60'}`}
                    >
                      <img src={img} alt="" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Title + price */}
            <div>
              <h1 className="font-['Playfair_Display'] text-3xl text-[#F5F0E8] mb-2">{listing.title}</h1>
              <div className="flex items-center gap-2 text-sm text-[#8A8070] mb-4">
                <MapPin className="w-4 h-4" />
                {listing.location}
              </div>
              <div className="text-3xl font-bold text-[#C9A84C]">
                ETB {formatPrice(listing.price)}
              </div>
            </div>

            {/* Description */}
            <div className="bg-[#1A1A1A] border border-[#C9A84C]/15 rounded-xl p-6">
              <h3 className="text-xs text-[#C9A84C] uppercase tracking-[3px] mb-4">{t('listing:details', 'Description')}</h3>
              <p className="text-sm text-[#C8C0B0] leading-relaxed whitespace-pre-wrap">{listing.description}</p>
            </div>

            {/* Specs */}
            <div className="bg-[#1A1A1A] border border-[#C9A84C]/15 rounded-xl p-6">
              <h3 className="text-xs text-[#C9A84C] uppercase tracking-[3px] mb-4">
                {isCar ? t('listing:carDetails', 'Car Details') : t('listing:houseDetails', 'Property Details')}
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {isCar && listing.carDetails && (
                  <>
                    <SpecItem icon={<Calendar className="w-4 h-4" />} label={t('listing:year', 'Year')} value={String(listing.carDetails.year)} />
                    <SpecItem icon={<Gauge className="w-4 h-4" />} label={t('listing:mileage', 'Mileage')} value={`${listing.carDetails.mileage.toLocaleString()} km`} />
                    <SpecItem icon={null} label={t('listing:transmission', 'Transmission')} value={listing.carDetails.transmission} />
                    <SpecItem icon={null} label={t('listing:fuelType', 'Fuel Type')} value={listing.carDetails.fuelType} />
                    <SpecItem icon={null} label={t('listing:make', 'Make')} value={listing.carDetails.make} />
                    <SpecItem icon={null} label={t('listing:color', 'Color')} value={listing.carDetails.color} />
                  </>
                )}
                {!isCar && listing.houseDetails && (
                  <>
                    <SpecItem icon={<BedDouble className="w-4 h-4" />} label={t('listing:bedrooms', 'Bedrooms')} value={String(listing.houseDetails.bedrooms)} />
                    <SpecItem icon={null} label={t('listing:bathrooms', 'Bathrooms')} value={String(listing.houseDetails.bathrooms)} />
                    <SpecItem icon={<Maximize2 className="w-4 h-4" />} label={t('listing:area', 'Area')} value={`${listing.houseDetails.areaSqm} m²`} />
                    <SpecItem icon={null} label={t('listing:propertyType', 'Type')} value={listing.houseDetails.propertyType} />
                    <SpecItem icon={null} label={t('listing:saleType', 'Sale Type')} value={listing.houseDetails.saleType === 'for_sale' ? t('listing:forSale', 'For Sale') : t('listing:forRent', 'For Rent')} />
                    <SpecItem icon={null} label={t('listing:furnished', 'Furnished')} value={listing.houseDetails.furnished ? t('common:yes', 'Yes') : t('common:no', 'No')} />
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Right: contact panel */}
          <div className="flex flex-col gap-4">
            <div className="bg-[#1A1A1A] border border-[#C9A84C]/25 rounded-xl p-6 sticky top-24">
              <div className="text-xs text-[#8A8070] mb-1">{t('listingDetail:listedOn', 'Listed on')}</div>
              <div className="text-sm text-[#C8C0B0] mb-6">{formatDate(listing.createdAt)}</div>

              {/* Public: contact sales */}
              {!isStaff && (
                <>
                  <div className="bg-[#111] rounded-lg p-4 mb-4 text-xs text-[#8A8070] border border-[#C9A84C]/10">
                    {t('listingDetail:interested', 'Interested? Contact our sales team and we\'ll connect you with the seller.')}
                  </div>
                  <Button onClick={() => setContactOpen(true)} className="w-full">
                    {t('listings:contactSales', 'Contact Sales Team')}
                  </Button>
                </>
              )}

              {/* Staff: show poster details */}
              {isStaff && listing.poster && (
                <div className="flex flex-col gap-3">
                  <div className="text-xs text-[#C9A84C] uppercase tracking-[2px] mb-2">
                    {t('listingDetail:posterDetailsStaffOnly', 'Poster Details — Staff Only')}
                  </div>
                  <div className="bg-[#111] rounded-lg p-4 border border-[#C9A84C]/10 flex flex-col gap-2">
                    <div className="text-sm font-medium text-[#F5F0E8]">{listing.poster.fullName}</div>
                    <a href={`tel:${listing.poster.phone}`} className="flex items-center gap-2 text-xs text-[#C8C0B0] hover:text-[#C9A84C] transition-colors">
                      <Phone className="w-3.5 h-3.5" />{listing.poster.phone}
                    </a>
                    {listing.poster.email && (
                      <a href={`mailto:${listing.poster.email}`} className="flex items-center gap-2 text-xs text-[#C8C0B0] hover:text-[#C9A84C] transition-colors">
                        <Mail className="w-3.5 h-3.5" />{listing.poster.email}
                      </a>
                    )}
                  </div>
                  <Link href="/dashboard/listings">
                    <Button variant="outline" className="w-full text-sm">
                      {t('listingDetail:manageInDashboard', 'Manage in Dashboard')}
                    </Button>
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      {listing && (
        <ContactModal open={contactOpen} onClose={() => setContactOpen(false)} listing={listing} />
      )}
      <Footer />
    </div>
  )
}

function SpecItem({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="bg-[#111] border border-[#C9A84C]/10 rounded-lg p-3">
      <div className="flex items-center gap-1.5 text-xs text-[#8A8070] mb-1">
        {icon}{label}
      </div>
      <div className="text-sm text-[#F5F0E8] font-medium capitalize">{value}</div>
    </div>
  )
}
