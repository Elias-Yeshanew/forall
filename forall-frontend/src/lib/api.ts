// src/lib/api.ts
import axios, { AxiosInstance, InternalAxiosRequestConfig } from 'axios'
import Cookies from 'js-cookie'
import {
  Listing,
  CreateListingDto,
  ListingFilters,
  PaginatedListings,
  Poster,
} from '@/types/listing'
import { LoginDto, LoginResponse, User, CreateUserDto } from '@/types/user'
import { Contact, CreateContactDto, UpdateContactDto } from '@/types/contact'

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'

const apiClient: AxiosInstance = axios.create({
  baseURL: BASE_URL,
  headers: { 'Content-Type': 'application/json' },
  timeout: 10000,
})

type ApiEnvelope<T> = {
  status: 'success' | 'error'
  data: T
  message?: string
}

// Attach JWT on every request
apiClient.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const token = Cookies.get('forall_token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

// Global error handler
apiClient.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      Cookies.remove('forall_token')
      if (typeof window !== 'undefined') window.location.href = '/login'
    }
    return Promise.reject(err)
  }
)

// ─── AUTH ───────────────────────────────────────────────────────────────────

export const authApi = {
  login: async (dto: LoginDto): Promise<LoginResponse> => {
    const res = await apiClient.post<ApiEnvelope<{ user: User; token: string }>>('/auth/login', dto)
    return res.data.data
  },

  register: async (dto: CreateUserDto): Promise<LoginResponse> => {
    const res = await apiClient.post<ApiEnvelope<{ user: User; token: string }>>('/auth/register', dto)
    return res.data.data
  },

  logout: async (): Promise<void> => {
    await apiClient.post('/auth/logout')
    Cookies.remove('forall_token')
  },

  me: async (): Promise<User> => {
    const res = await apiClient.get<ApiEnvelope<{ user: User }>>('/auth/me')
    return res.data.data.user
  },

  refresh: async (): Promise<{ token: string }> => {
    const res = await apiClient.post<ApiEnvelope<{ token: string }>>('/auth/refresh')
    return { token: res.data.data.token }
  },

  loginWithGoogle: async (idToken: string): Promise<LoginResponse> => {
    const res = await apiClient.post<ApiEnvelope<{ user: User; token: string }>>('/auth/google', { idToken })
    return res.data.data
  },
}

// ─── LISTINGS ───────────────────────────────────────────────────────────────

export const listingsApi = {
  getAll: async (filters: ListingFilters = {}): Promise<PaginatedListings> => {
    const params = new URLSearchParams()
    Object.entries(filters).forEach(([k, v]) => {
      if (v !== undefined && v !== '') params.append(k, String(v))
    })
    const res = await apiClient.get<{ status: 'success' } & PaginatedListings>(`/listings?${params}`)
    const { status: _status, ...payload } = res.data
    return payload
  },

  getById: async (id: string): Promise<Listing> => {
    const res = await apiClient.get<ApiEnvelope<{ listing: Listing }>>(`/listings/${id}`)
    return res.data.data.listing
  },

  // Sales/Admin only — returns poster contact info
  getPosterDetails: async (listingId: string): Promise<Poster> => {
    const res = await apiClient.get<ApiEnvelope<{ poster: Poster }>>(`/listings/${listingId}/poster`)
    return res.data.data.poster
  },

  create: async (dto: CreateListingDto): Promise<Listing> => {
    const res = await apiClient.post<ApiEnvelope<{ listing: Listing }>>('/listings', dto)
    return res.data.data.listing
  },

  update: async (id: string, dto: Partial<CreateListingDto>): Promise<Listing> => {
    const res = await apiClient.put<ApiEnvelope<{ listing: Listing }>>(`/listings/${id}`, dto)
    return res.data.data.listing
  },

  updateStatus: async (id: string, status: string): Promise<Listing> => {
    const res = await apiClient.patch<ApiEnvelope<{ listing: Listing }>>(`/listings/${id}/status`, { status })
    return res.data.data.listing
  },

  delete: async (id: string): Promise<void> => {
    await apiClient.delete(`/listings/${id}`)
  },

  uploadImages: async (files: File[], title?: string): Promise<string[]> => {
    const form = new FormData()
    files.forEach((f) => form.append('images', f))
    if (title) form.append('title', title)
    
    const token = Cookies.get('forall_token')
    const headers: Record<string, string> = {}
    if (token) headers['Authorization'] = `Bearer ${token}`
    
    const res = await fetch(`${BASE_URL}/listings/upload`, {
      method: 'POST',
      headers,
      body: form
    })
    
    if (!res.ok) {
      throw new Error('Upload failed')
    }
    const json = await res.json()
    return json.data.urls
  },

  // Admin/Sales: get all with poster info
  getAllAdmin: async (filters: ListingFilters = {}): Promise<PaginatedListings> => {
    const params = new URLSearchParams()
    Object.entries(filters).forEach(([k, v]) => {
      if (v !== undefined && v !== '') params.append(k, String(v))
    })
    const res = await apiClient.get<{ status: 'success' } & PaginatedListings>(`/listings/admin?${params}`)
    const { status: _status, ...payload } = res.data
    return payload
  },

  getStats: async (): Promise<{
    total: number
    cars: number
    houses: number
    pending: number
  }> => {
    const res = await apiClient.get<ApiEnvelope<{ stats: { total: number; cars: number; houses: number; pending: number } }>>('/listings/stats')
    return res.data.data.stats
  },
}

// ─── CONTACTS ───────────────────────────────────────────────────────────────

export const contactsApi = {
  // Public: submit inquiry to sales team
  submit: async (dto: CreateContactDto): Promise<Contact> => {
    const res = await apiClient.post<ApiEnvelope<{ contact: Contact }>>('/contacts', dto)
    return res.data.data.contact
  },

  // Sales/Admin only
  getAll: async (params?: { status?: string; page?: number }): Promise<{
    data: Contact[]
    total: number
    unread: number
  }> => {
    const res = await apiClient.get<{ status: 'success'; data: Contact[]; total: number; unread: number }>('/contacts', { params })
    const { status: _status, ...payload } = res.data
    return payload
  },

  update: async (id: string, dto: UpdateContactDto): Promise<Contact> => {
    const res = await apiClient.patch<ApiEnvelope<{ contact: Contact }>>(`/contacts/${id}`, dto)
    return res.data.data.contact
  },

  getStats: async (): Promise<{ total: number; unread: number; replied: number }> => {
    const res = await apiClient.get<ApiEnvelope<{ stats: { total: number; unread: number; replied: number } }>>('/contacts/stats')
    return res.data.data.stats
  },
}

// ─── USERS (Admin only) ──────────────────────────────────────────────────────

export const usersApi = {
  getAll: async (): Promise<User[]> => {
    const res = await apiClient.get<ApiEnvelope<{ users: User[] }>>('/users')
    return res.data.data.users
  },

  create: async (dto: CreateUserDto): Promise<User> => {
    const res = await apiClient.post<ApiEnvelope<{ user: User }>>('/users', dto)
    return res.data.data.user
  },

  update: async (id: string, dto: Partial<CreateUserDto>): Promise<User> => {
    const res = await apiClient.put<ApiEnvelope<{ user: User }>>(`/users/${id}`, dto)
    return res.data.data.user
  },

  delete: async (id: string): Promise<void> => {
    await apiClient.delete(`/users/${id}`)
  },
}

// ─── CHAT ────────────────────────────────────────────────────────────────────

export const chatApi = {
  getConversations: async () => {
    const res = await apiClient.get<ApiEnvelope<any>>('/chat/conversations')
    return res.data.data
  },

  startConversation: async (listingId: string) => {
    const res = await apiClient.post<ApiEnvelope<any>>('/chat/conversations', { listingId })
    return res.data.data
  },

  getMessages: async (conversationId: string) => {
    const res = await apiClient.get<ApiEnvelope<any>>(`/chat/conversations/${conversationId}/messages`)
    return res.data.data
  },

  sendMessage: async (conversationId: string, content: string) => {
    const res = await apiClient.post<ApiEnvelope<any>>(`/chat/conversations/${conversationId}/messages`, { content })
    return res.data.data
  },
}

export default apiClient
