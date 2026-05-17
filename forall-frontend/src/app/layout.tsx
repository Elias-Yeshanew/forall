// src/app/layout.tsx
import type { Metadata } from 'next'
import './globals.css'
import { Providers } from './providers'

export const metadata: Metadata = {
  title: 'Forall — Ethiopia\'s Premium Broker',
  description: 'Buy, sell, and rent cars and properties in Ethiopia. Ethiopia\'s most trusted broker marketplace.',
  keywords: ['Ethiopia', 'cars', 'houses', 'real estate', 'broker', 'Addis Ababa'],
  openGraph: {
    title: 'Forall — Ethiopia\'s Premium Broker',
    description: 'Buy, sell, and rent cars and properties in Ethiopia.',
    type: 'website',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
