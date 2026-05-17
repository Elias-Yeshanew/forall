// src/app/(public)/page.tsx
import { MOCK_LISTINGS } from '@/lib/mockListings'
import { HomeClient } from '@/components/home/HomeClient'

async function getFeaturedListings() {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/listings?limit=4&status=active`,
      { next: { revalidate: 60 } }
    )
    if (!res.ok) return []
    const data = await res.json()
    const apiData = data.data ?? []
    if (!apiData.length) return MOCK_LISTINGS.slice(0, 4)
    return apiData
  } catch {
    return MOCK_LISTINGS.slice(0, 4)
  }
}

export default async function HomePage() {
  const featured = await getFeaturedListings()
  return <HomeClient featured={featured} />
}
