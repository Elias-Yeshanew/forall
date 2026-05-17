'use client'
// src/components/layout/Footer.tsx
import Link from 'next/link'
import { useTranslation } from 'react-i18next'

export function Footer() {
  const { t } = useTranslation(['footer', 'nav', 'common'])
  return (
    <footer className="bg-[#111] border-t border-[#C9A84C]/15 mt-20">
      <div className="max-w-7xl mx-auto px-6 py-12 grid grid-cols-1 md:grid-cols-3 gap-10">
        {/* Brand */}
        <div>
          <div className="font-['Playfair_Display'] text-2xl font-bold tracking-widest text-[#C9A84C] mb-3">
            FOR<span className="text-[#F5F0E8] font-normal">ALL</span>
          </div>
          <p className="text-sm text-[#8A8070] leading-relaxed">
            {t('common:tagline', "Ethiopia's Premium Broker Platform")}
          </p>
        </div>

        {/* Links */}
        <div>
          <h4 className="text-xs text-[#C9A84C] uppercase tracking-widest mb-4">{t('footer:quickLinks', 'Quick Links')}</h4>
          <ul className="flex flex-col gap-2">
            {[
              { href: '/', label: t('nav:home', 'Home') },
              { href: '/listings', label: t('nav:listings', 'Listings') },
              { href: '/listings?type=car', label: t('common:car', 'Cars') },
              { href: '/listings?type=house', label: t('common:house', 'Houses') },
              { href: '/post', label: t('nav:post', 'Post Listing') },
            ].map((l) => (
              <li key={l.href}>
                <Link href={l.href} className="text-sm text-[#8A8070] hover:text-[#C9A84C] transition-colors">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h4 className="text-xs text-[#C9A84C] uppercase tracking-widest mb-4">{t('footer:contact', 'Contact')}</h4>
          <ul className="flex flex-col gap-2 text-sm text-[#8A8070]">
            <li>📍 Bole, Addis Ababa, Ethiopia</li>
            <li>📞 +251 911 000 000</li>
            <li>✉️ sales@forall.et</li>
          </ul>
        </div>
      </div>

      <div className="border-t border-[#C9A84C]/10 px-6 py-4 text-center text-xs text-[#8A8070]">
        © {new Date().getFullYear()} {t('common:appName', 'Forall')}. {t('footer:allRightsReserved', 'All rights reserved.')}
      </div>
    </footer>
  )
}
