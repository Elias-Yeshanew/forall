'use client'
// src/hooks/useListings.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { listingsApi } from '@/lib/api'
import { ListingFilters, CreateListingDto } from '@/types/listing'

export const LISTINGS_KEY = 'listings'

export function useListings(filters: ListingFilters = {}) {
  return useQuery({
    queryKey: [LISTINGS_KEY, filters],
    queryFn: () => listingsApi.getAll(filters),
    staleTime: 1000 * 60 * 2,
  })
}

export function useListing(id: string) {
  return useQuery({
    queryKey: [LISTINGS_KEY, id],
    queryFn: () => listingsApi.getById(id),
    enabled: !!id,
  })
}

export function useAdminListings(filters: ListingFilters = {}) {
  return useQuery({
    queryKey: [LISTINGS_KEY, 'admin', filters],
    queryFn: () => listingsApi.getAllAdmin(filters),
    staleTime: 1000 * 30,
  })
}

export function useListingStats() {
  return useQuery({
    queryKey: [LISTINGS_KEY, 'stats'],
    queryFn: () => listingsApi.getStats(),
    staleTime: 1000 * 60,
  })
}

export function usePosterDetails(listingId: string, enabled = false) {
  return useQuery({
    queryKey: [LISTINGS_KEY, listingId, 'poster'],
    queryFn: () => listingsApi.getPosterDetails(listingId),
    enabled,
  })
}

export function useCreateListing() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (dto: CreateListingDto) => listingsApi.create(dto),
    onSuccess: () => qc.invalidateQueries({ queryKey: [LISTINGS_KEY] }),
  })
}

export function useUpdateListingStatus() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) =>
      listingsApi.updateStatus(id, status),
    onSuccess: () => qc.invalidateQueries({ queryKey: [LISTINGS_KEY] }),
  })
}

export function useDeleteListing() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => listingsApi.delete(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: [LISTINGS_KEY] }),
  })
}
