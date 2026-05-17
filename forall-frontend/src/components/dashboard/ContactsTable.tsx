'use client'
// src/components/dashboard/ContactsTable.tsx
import { Loader2, CheckCheck, MessageSquare } from 'lucide-react'
import { useContacts, useUpdateContact } from '@/hooks/useContacts'
import { Badge } from '@/components/ui/Badge'
import { formatDate } from '@/lib/utils'
import toast from 'react-hot-toast'
import { useTranslation } from 'react-i18next'

export function ContactsTable() {
  const { t } = useTranslation('contactsTable')
  const { data, isLoading } = useContacts()
  const { mutateAsync: updateContact } = useUpdateContact()

  const handleMarkRead = async (id: string) => {
    try {
      await updateContact({ id, dto: { status: 'read' } })
      toast.success('Marked as read')
    } catch {
      toast.error('Failed to update')
    }
  }

  const handleMarkReplied = async (id: string) => {
    try {
      await updateContact({ id, dto: { status: 'replied' } })
      toast.success('Marked as replied')
    } catch {
      toast.error('Failed to update')
    }
  }

  return (
    <div className="bg-[#1A1A1A] border border-[#C9A84C]/20 rounded-xl overflow-hidden">
      <div className="px-5 py-4 border-b border-[#C9A84C]/15">
        <h3 className="text-sm font-medium text-[#F5F0E8]">{t('customerInquiries', 'Customer Contact Requests')}</h3>
        <p className="text-xs text-[#8A8070] mt-0.5">
          {t('customersContactYourTeam', 'Customers contact your team — not the poster directly')}
        </p>
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
                  t('customer', 'Customer'),
                  t('phone', 'Phone'),
                  t('message', 'Message'),
                  t('listing', 'Listing'),
                  t('date', 'Date'),
                  t('status', 'Status'),
                  t('actions', 'Actions')
                ].map((h) => (
                  <th key={h} className="table-th">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {data?.data.map((contact) => (
                <tr
                  key={contact.id}
                  className={`hover:bg-[#222]/60 transition-colors ${contact.status === 'unread' ? 'bg-[#C9A84C]/3' : ''}`}
                >
                  <td className="table-td text-[#F5F0E8] font-medium">{contact.name}</td>
                  <td className="table-td">{contact.phone}</td>
                  <td className="table-td max-w-[220px]">
                    <p className="text-xs text-[#C8C0B0] truncate">{contact.message}</p>
                  </td>
                  <td className="table-td text-[#C9A84C] text-xs max-w-[140px]">
                    <span className="truncate block">{contact.listingTitle}</span>
                  </td>
                  <td className="table-td text-xs">{formatDate(contact.createdAt)}</td>
                  <td className="table-td">
                    <Badge variant={contact.status as 'unread' | 'replied'}>{contact.status}</Badge>
                  </td>
                  <td className="table-td">
                    <div className="flex items-center gap-1.5">
                      {contact.status === 'unread' && (
                        <button
                          onClick={() => handleMarkRead(contact.id)}
                          className="p-1.5 rounded text-[#8A8070] hover:text-[#C9A84C] hover:bg-[#C9A84C]/10 transition-all"
                          title="Mark as read"
                        >
                          <MessageSquare className="w-3.5 h-3.5" />
                        </button>
                      )}
                      {contact.status !== 'replied' && (
                        <button
                          onClick={() => handleMarkReplied(contact.id)}
                          className="p-1.5 rounded text-[#8A8070] hover:text-emerald-400 hover:bg-emerald-400/10 transition-all"
                          title="Mark as replied"
                        >
                          <CheckCheck className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
              {!data?.data.length && (
                <tr>
                  <td colSpan={7} className="text-center py-12 text-[#8A8070] text-sm">
                    {t('noContactRequests', 'No contact requests yet')}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}
