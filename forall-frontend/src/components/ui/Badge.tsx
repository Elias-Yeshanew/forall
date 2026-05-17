'use client'
// src/components/ui/Badge.tsx
import { cn } from '@/lib/utils'

interface BadgeProps {
  variant?: 'car' | 'house' | 'active' | 'pending' | 'sold' | 'unread' | 'replied' | 'rented'
  children: React.ReactNode
  className?: string
}

const variantMap: Record<string, string> = {
  car: 'badge-car',
  house: 'badge-house',
  active: 'status-active',
  pending: 'status-pending',
  sold: 'status-sold',
  rented: 'status-sold',
  unread: 'status-unread',
  replied: 'status-replied',
}

export function Badge({ variant = 'active', children, className }: BadgeProps) {
  return (
    <span className={cn(variantMap[variant], className)}>
      {children}
    </span>
  )
}
