'use client'
// src/hooks/useContacts.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { contactsApi } from '@/lib/api'
import { CreateContactDto, UpdateContactDto } from '@/types/contact'

export const CONTACTS_KEY = 'contacts'

export function useContacts(params?: { status?: string; page?: number }) {
  return useQuery({
    queryKey: [CONTACTS_KEY, params],
    queryFn: () => contactsApi.getAll(params),
    staleTime: 1000 * 30,
  })
}

export function useContactStats() {
  return useQuery({
    queryKey: [CONTACTS_KEY, 'stats'],
    queryFn: () => contactsApi.getStats(),
    staleTime: 1000 * 60,
  })
}

export function useSubmitContact() {
  return useMutation({
    mutationFn: (dto: CreateContactDto) => contactsApi.submit(dto),
  })
}

export function useUpdateContact() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, dto }: { id: string; dto: UpdateContactDto }) =>
      contactsApi.update(id, dto),
    onSuccess: () => qc.invalidateQueries({ queryKey: [CONTACTS_KEY] }),
  })
}
