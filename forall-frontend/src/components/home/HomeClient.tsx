'use client'
// src/components/home/HomeClient.tsx
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { ListingGrid } from '@/components/listings/ListingGrid'
import Link from 'next/link'
import { useTranslation } from 'react-i18next'
import { Listing } from '@/types/listing'

export function HomeClient({ featured }: { featured: Listing[] }) {
  const { t } = useTranslation(['hero', 'stats', 'home', 'common'])

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      {/* Hero */}
      <section className="relative bg-[#0A0A0A] overflow-hidden">
        <div
          className="absolute inset-0 bg-center bg-cover opacity-30"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1460317442991-0ec209397118?auto=format&fit=crop&w=2000&q=80')",
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-br from-[#0F172A]/85 via-[#0F172A]/80 to-[#0B1220]/85" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_0%,rgba(20,184,166,0.18)_0%,transparent_70%)]" />
        <div className="relative max-w-4xl mx-auto px-6 py-28 text-center">
          <p className="text-xs text-[#C9A84C] uppercase tracking-[5px] mb-5">
            {t('hero:eyebrow', "Ethiopia's Premium Broker Platform")}
          </p>
          <h1 className="font-['Playfair_Display'] text-5xl md:text-6xl font-bold text-[#F5F0E8] leading-tight mb-5">
            {t('hero:title', "Find Your Dream Car or Home")}
          </h1>
          <p className="text-[#8A8070] text-lg mb-10 max-w-xl mx-auto leading-relaxed">
            {t('hero:subtitle', "Ethiopia's most trusted marketplace for premium cars and properties. Post, discover, and connect with ease.")}
          </p>

          <div className="flex gap-4 justify-center flex-wrap">
            <Link href="/listings" className="btn-gold text-sm">
              {t('hero:browseCta', "Browse Listings")}
            </Link>
            <Link href="/post" className="btn-outline text-sm">
              {t('hero:postCta', "Post Now")}
            </Link>
          </div>

          {/* Stats */}
          <div className="mt-16 pt-10 border-t border-[#C9A84C]/15 flex justify-center gap-12 flex-wrap">
            {[
              { num: '1,240+', label: t('stats:activeListings', 'Active Listings') },
              { num: '380+',   label: t('stats:carsListed', 'Cars Listed') },
              { num: '860+',   label: t('stats:properties', 'Properties') },
              { num: '98%',    label: t('stats:satisfaction', 'Satisfaction') },
            ].map((s) => (
              <div key={s.label} className="text-center">
                <div className="font-['Playfair_Display'] text-3xl font-bold text-[#C9A84C]">{s.num}</div>
                <div className="text-xs text-[#8A8070] mt-1">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Category cards */}
      <section className="relative max-w-7xl mx-auto px-6 py-16">
        <div
          className="absolute inset-0 -z-10 opacity-30 rounded-2xl bg-center bg-cover"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1487958449943-2429e8be8625?auto=format&fit=crop&w=2000&q=80')",
          }}
        />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-16">
          <Link href="/listings?type=car" className="group relative bg-[#111] border border-[#C9A84C]/20 rounded-2xl p-10 overflow-hidden hover:border-[#C9A84C]/50 transition-all duration-300 hover:-translate-y-1">
            <div className="absolute -right-6 -top-6 text-9xl opacity-10 group-hover:opacity-20 transition-opacity">🚗</div>
            <div className="relative">
              <div className="badge-car inline-block mb-4">Cars / መኪናዎች</div>
              <h2 className="font-['Playfair_Display'] text-2xl text-[#F5F0E8] mb-3">{t('home:findCar', 'Find Your Car')}</h2>
              <p className="text-sm text-[#8A8070] mb-6 leading-relaxed">{t('home:findCarDesc', 'Browse sedans, SUVs, pickups and luxury cars from verified sellers across Ethiopia.')}</p>
              <span className="text-sm text-[#C9A84C] group-hover:underline">{t('home:browseCarsLink', 'Browse Cars →')}</span>
            </div>
          </Link>

          <Link href="/listings?type=house" className="group relative bg-[#111] border border-[#C9A84C]/20 rounded-2xl p-10 overflow-hidden hover:border-[#C9A84C]/50 transition-all duration-300 hover:-translate-y-1">
            <div className="absolute -right-6 -top-6 text-9xl opacity-10 group-hover:opacity-20 transition-opacity">🏡</div>
            <div className="relative">
              <div className="badge-house inline-block mb-4">Houses / ቤቶች</div>
              <h2 className="font-['Playfair_Display'] text-2xl text-[#F5F0E8] mb-3">{t('home:findHome', 'Find Your Home')}</h2>
              <p className="text-sm text-[#8A8070] mb-6 leading-relaxed">{t('home:findHomeDesc', 'Discover villas, apartments, and properties for sale or rent in Addis Ababa and beyond.')}</p>
              <span className="text-sm text-[#C9A84C] group-hover:underline">{t('home:browsePropertiesLink', 'Browse Properties →')}</span>
            </div>
          </Link>
        </div>

        {/* Featured listings */}
        <div className="section-title mb-6">{t('home:featuredListings', 'Featured Listings')}</div>
        <ListingGrid listings={featured} />

        <div className="text-center mt-10">
          <Link href="/listings" className="btn-outline text-sm">
            {t('home:viewAllListings', 'View All Listings →')}
          </Link>
        </div>
      </section>

      {/* How it works */}
      <section className="bg-[#111] border-y border-[#C9A84C]/15 py-20">
        <div className="max-w-5xl mx-auto px-6">
          <div className="text-center mb-14">
            <p className="text-xs text-[#C9A84C] uppercase tracking-[4px] mb-3">{t('home:simpleProcess', 'Simple Process')}</p>
            <h2 className="font-['Playfair_Display'] text-3xl text-[#F5F0E8]">{t('home:howItWorks', 'How It Works')}</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { step: '01', title: t('home:step1Title'), desc: t('home:step1Desc') },
              { step: '02', title: t('home:step2Title'), desc: t('home:step2Desc') },
              { step: '03', title: t('home:step3Title'), desc: t('home:step3Desc') },
            ].map((s) => (
              <div key={s.step} className="text-center">
                <div className="font-['Playfair_Display'] text-5xl font-bold text-[#C9A84C]/20 mb-4">{s.step}</div>
                <h3 className="font-['Playfair_Display'] text-lg text-[#F5F0E8] mb-1">{s.title}</h3>
                <p className="text-sm text-[#8A8070] leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
