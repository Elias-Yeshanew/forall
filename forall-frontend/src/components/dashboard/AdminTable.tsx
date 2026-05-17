'use client'
// src/components/dashboard/AdminTable.tsx
import { useState } from 'react'
import { Loader2, Eye, Trash2, CheckCircle, XCircle } from 'lucide-react'
import { useAdminListings, useUpdateListingStatus, useDeleteListing } from '@/hooks/useListings'
import { Badge } from '@/components/ui/Badge'
import { formatPrice, formatDate } from '@/lib/utils'
import { ListingFilters } from '@/types/listing'
import toast from 'react-hot-toast'
import Link from 'next/link'
import { useTranslation } from 'react-i18next'

export function AdminTable() {
  const { t } = useTranslation('adminTable')
  const [filters, setFilters] = useState<ListingFilters>({ page: 1, limit: 15 })
  const { data, isLoading } = useAdminListings(filters)
  const { mutateAsync: updateStatus } = useUpdateListingStatus()
  const { mutateAsync: deleteListing } = useDeleteListing()

  const handleApprove = async (id: string) => {
    try {
      await updateStatus({ id, status: 'active' })
      toast.success('Listing approved')
    } catch {
      toast.error('Failed to approve listing')
    }
  }

  const handleReject = async (id: string) => {
    try {
      await updateStatus({ id, status: 'sold' })
      toast.success('Listing rejected')
    } catch {
      toast.error('Failed to reject listing')
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this listing?')) return
    try {
      await deleteListing(id)
      toast.success('Listing deleted')
    } catch {
      toast.error('Failed to delete listing')
    }
  }

  return (
    <div className="bg-[#1A1A1A] border border-[#C9A84C]/20 rounded-xl overflow-hidden">
      <div className="flex items-center justify-between px-5 py-4 border-b border-[#C9A84C]/15">
        <div>
          <h3 className="text-sm font-medium text-[#F5F0E8]">{t('all', 'All Listings')}</h3>
          <p className="text-xs text-[#8A8070] mt-0.5">{t('posterDetails', 'Poster details visible to staff only')}</p>
        </div>
        <div className="flex gap-2">
          {(['all', 'pending', 'active'] as const).map((s) => (
            <button
              key={s}
              onClick={() => setFilters({ ...filters, status: s === 'all' ? undefined : s, page: 1 })}
              className={`text-xs px-3 py-1.5 rounded border transition-all ${
                (filters.status ?? 'all') === s
                  ? 'border-[#C9A84C] text-[#C9A84C] bg-[#C9A84C]/10'
                  : 'border-[#C9A84C]/20 text-[#8A8070] hover:text-[#C8C0B0]'
              }`}
            >
              {t(s, s.charAt(0).toUpperCase() + s.slice(1))}
            </button>
          ))}
        </div>
      </div>

      <div className="overflow-x-auto">
        {isLoading ? (
          <div className="flex items-center justify-center py-16">
            <Loader2 className="w-6 h-6 animate-spin text-[#C9A84C]" />
          </div>
        ) : (
          <table className="w-full">
            <thead>
              <tr>
                {[
                  t('title', 'Title'),
                  t('type', 'Type'),
                  t('priceEtb', 'Price (ETB)'),
                  t('posterName', 'Poster Name'),
                  t('phone', 'Phone'),
                  t('email', 'Email'),
                  t('date', 'Date'),
                  t('status', 'Status'),
                  t('actions', 'Actions')
                ].map((h) => (
                  <th key={h} className="table-th">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {data?.data.map((listing) => (
                <tr key={listing.id} className="hover:bg-[#222]/60 transition-colors">
                  <td className="table-td">
                    <Link href={`/listings/${listing.id}`} className="text-[#F5F0E8] hover:text-[#C9A84C] transition-colors font-medium max-w-[160px] block truncate">
                      {listing.title}
                    </Link>
                  </td>
                  <td className="table-td">
                    <Badge variant={listing.type as 'car' | 'house'}>{listing.type}</Badge>
                  </td>
                  <td className="table-td text-[#C9A84C] font-medium">
                    {formatPrice(listing.price)}
                  </td>
                  <td className="table-td text-[#F5F0E8]">{listing.poster?.fullName ?? '—'}</td>
                  <td className="table-td">{listing.poster?.phone ?? '—'}</td>
                  <td className="table-td text-xs">{listing.poster?.email ?? '—'}</td>
                  <td className="table-td text-xs">{formatDate(listing.createdAt)}</td>
                  <td className="table-td">
                    <Badge variant={listing.status as 'active' | 'pending' | 'sold'}>{listing.status}</Badge>
                  </td>
                  <td className="table-td">
                    <div className="flex items-center gap-1.5">
                      <Link href={`/listings/${listing.id}`}>
                        <button className="p-1.5 rounded text-[#8A8070] hover:text-[#C9A84C] hover:bg-[#C9A84C]/10 transition-all">
                          <Eye className="w-3.5 h-3.5" />
                        </button>
                      </Link>
                      {listing.status === 'pending' && (
                        <>
                          <button
                            onClick={() => handleApprove(listing.id)}
                            className="p-1.5 rounded text-[#8A8070] hover:text-emerald-400 hover:bg-emerald-400/10 transition-all"
                          >
                            <CheckCircle className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleReject(listing.id)}
                            className="p-1.5 rounded text-[#8A8070] hover:text-red-400 hover:bg-red-400/10 transition-all"
                          >
                            <XCircle className="w-3.5 h-3.5" />
                          </button>
                        </>
                      )}
                      <button
                        onClick={() => handleDelete(listing.id)}
                        className="p-1.5 rounded text-[#8A8070] hover:text-red-400 hover:bg-red-400/10 transition-all"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {!data?.data.length && (
                <tr>
                  <td colSpan={9} className="text-center py-12 text-[#8A8070] text-sm">
                    No listings found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>

      {/* Pagination */}
      {data && data.totalPages > 1 && (
        <div className="flex items-center justify-between px-5 py-3 border-t border-[#C9A84C]/15">
          <span className="text-xs text-[#8A8070]">
            {data.total} total listings
          </span>
          <div className="flex gap-2">
            <button
              disabled={filters.page === 1}
              onClick={() => setFilters({ ...filters, page: (filters.page ?? 1) - 1 })}
              className="text-xs px-3 py-1.5 border border-[#C9A84C]/20 rounded text-[#8A8070] hover:text-[#C9A84C] disabled:opacity-30 transition-colors"
            >
              Previous
            </button>
            <button
              disabled={filters.page === data.totalPages}
              onClick={() => setFilters({ ...filters, page: (filters.page ?? 1) + 1 })}
              className="text-xs px-3 py-1.5 border border-[#C9A84C]/20 rounded text-[#8A8070] hover:text-[#C9A84C] disabled:opacity-30 transition-colors"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
