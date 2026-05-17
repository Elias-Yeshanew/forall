'use client'
// src/components/dashboard/KPICards.tsx
import { TrendingUp, Car, Home, MessageSquare, Loader2 } from 'lucide-react'
import { useListingStats } from '@/hooks/useListings'
import { useContactStats } from '@/hooks/useContacts'
import { useTranslation } from 'react-i18next'

function KPICard({
  label, value, sub, icon, color,
}: {
  label: string; value: string | number; sub?: string; icon: React.ReactNode; color: string
}) {
  return (
    <div className="bg-[#1A1A1A] border border-[#C9A84C]/20 rounded-xl p-5">
      <div className="flex items-start justify-between mb-4">
        <div>
          <p className="text-[10px] text-[#8A8070] uppercase tracking-widest">{label}</p>
        </div>
        <div className={`p-2 rounded-lg ${color}`}>{icon}</div>
      </div>
      <div className="font-['Playfair_Display'] text-3xl font-bold text-[#C9A84C] mb-1">{value}</div>
      {sub && <p className="text-xs text-[#8A8070]">{sub}</p>}
    </div>
  )
}

export function KPICards() {
  const { t } = useTranslation('dashboard')
  const { data: listingStats, isLoading: lLoading } = useListingStats()
  const { data: contactStats, isLoading: cLoading } = useContactStats()

  if (lLoading || cLoading) {
    return (
      <div className="flex items-center justify-center py-10">
        <Loader2 className="w-6 h-6 animate-spin text-[#C9A84C]" />
      </div>
    )
  }

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      <KPICard
        label={t('totalListings', 'Total Listings')}
        value={listingStats?.total ?? 0}
        sub={`${listingStats?.pending ?? 0} ${t('pendingReview', 'pending review')}`}
        icon={<TrendingUp className="w-4 h-4 text-[#C9A84C]" />}
        color="bg-[#C9A84C]/10"
      />
      <KPICard
        label={t('totalCars', 'Cars')}
        value={listingStats?.cars ?? 0}
        icon={<Car className="w-4 h-4 text-blue-400" />}
        color="bg-blue-400/10"
      />
      <KPICard
        label={t('totalHouses', 'Houses')}
        value={listingStats?.houses ?? 0}
        icon={<Home className="w-4 h-4 text-emerald-400" />}
        color="bg-emerald-400/10"
      />
      <KPICard
        label={t('contacts', 'Contact Requests')}
        value={contactStats?.total ?? 0}
        sub={`${contactStats?.unread ?? 0} ${t('unread', 'unread')}`}
        icon={<MessageSquare className="w-4 h-4 text-purple-400" />}
        color="bg-purple-400/10"
      />
    </div>
  )
}
