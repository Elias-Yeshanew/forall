'use client'
// src/app/(auth)/dashboard/page.tsx
import { Navbar } from '@/components/layout/Navbar'
import { RoleGuard } from '@/components/layout/RoleGuard'
import { KPICards } from '@/components/dashboard/KPICards'
import { AdminTable } from '@/components/dashboard/AdminTable'
import { ContactsTable } from '@/components/dashboard/ContactsTable'
import { useAuth } from '@/context/AuthContext'
import { useTranslation } from 'react-i18next'

export default function DashboardPage() {
  return (
    <RoleGuard allowedRoles={['admin', 'sales']}>
      <DashboardContent />
    </RoleGuard>
  )
}

function DashboardContent() {
  const { t } = useTranslation('dashboard')
  const { user } = useAuth()
  const isAdmin = user?.role === 'admin'

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-1">
            <h1 className="font-['Playfair_Display'] text-3xl text-[#F5F0E8]">
              {isAdmin ? t('adminTitle', 'Admin Dashboard') : t('salesTitle', 'Sales Dashboard')}
            </h1>
            <span className={`text-xs px-3 py-1 rounded-full font-medium ${
              isAdmin
                ? 'bg-red-600/15 text-red-400 border border-red-600/25'
                : 'bg-emerald-600/15 text-emerald-400 border border-emerald-600/25'
            }`}>
              {user?.role}
            </span>
          </div>
          <p className="text-sm text-[#8A8070]">
            {isAdmin
              ? t('fullAccess', 'Full access — all listings, poster details, users, and settings.')
              : t('salesAccess', 'View listings with poster details and manage customer inquiries.')}
          </p>
        </div>

        {/* KPI cards */}
        <div className="mb-8">
          <KPICards />
        </div>

        {/* Listings table */}
        <div className="mb-8">
          <div className="section-title mb-5">
            {t('listingsManagement', 'Listings Management')}
            <span className="text-xs text-[#8A8070] font-normal normal-case ml-2">
              {t('posterDetails', 'Poster details visible to staff only')}
            </span>
          </div>
          <AdminTable />
        </div>

        {/* Contacts table */}
        <div className="mb-8">
          <div className="section-title mb-5">
            {t('customerInquiries', 'Customer Inquiries')}
            <span className="text-xs text-[#8A8070] font-normal normal-case ml-2">
              {t('customerInquiriesDesc', 'All contact requests routed through sales team')}
            </span>
          </div>
          <ContactsTable />
        </div>
      </main>
    </div>
  )
}
