// src/lib/utils.ts
import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatPrice(amount: number): string {
  return new Intl.NumberFormat('en-ET').format(amount)
}

export function formatDate(dateStr: string): string {
  return new Intl.DateTimeFormat('en-ET', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }).format(new Date(dateStr))
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/--+/g, '-')
    .trim()
}

export function truncate(str: string, maxLen = 80): string {
  return str.length > maxLen ? str.slice(0, maxLen) + '…' : str
}

export function getListingTypeLabel(type: string, lang: 'en' | 'am' = 'en') {
  const map: Record<string, Record<string, string>> = {
    car: { en: 'Car', am: 'መኪና' },
    house: { en: 'House', am: 'ቤት' },
  }
  return map[type]?.[lang] ?? type
}
