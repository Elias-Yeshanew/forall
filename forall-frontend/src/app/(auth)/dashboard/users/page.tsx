'use client'
// src/app/(auth)/dashboard/users/page.tsx
import { useState } from 'react'
import { Navbar } from '@/components/layout/Navbar'
import { RoleGuard } from '@/components/layout/RoleGuard'
import { Button } from '@/components/ui/Button'
import { Input, Select } from '@/components/ui/Input'
import { Modal } from '@/components/ui/Modal'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { usersApi } from '@/lib/api'
import { formatDate } from '@/lib/utils'
import { UserPlus, Trash2, Loader2 } from 'lucide-react'
import toast from 'react-hot-toast'
import Link from 'next/link'

export default function UsersPage() {
  return (
    <RoleGuard allowedRoles={['admin']}>
      <UsersContent />
    </RoleGuard>
  )
}

function UsersContent() {
  const [modalOpen, setModalOpen] = useState(false)
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'sales' as const })
  const qc = useQueryClient()

  const { data: users, isLoading } = useQuery({
    queryKey: ['users'],
    queryFn: () => usersApi.getAll(),
  })

  const { mutateAsync: createUser, isPending } = useMutation({
    mutationFn: () => usersApi.create(form),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['users'] })
      setModalOpen(false)
      setForm({ name: '', email: '', password: '', role: 'sales' })
      toast.success('Staff member added')
    },
    onError: () => toast.error('Failed to add user'),
  })

  const { mutateAsync: deleteUser } = useMutation({
    mutationFn: (id: string) => usersApi.delete(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['users'] })
      toast.success('User removed')
    },
  })

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 max-w-5xl mx-auto w-full px-4 sm:px-6 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <Link href="/dashboard" className="text-xs text-[#8A8070] hover:text-[#C9A84C] mb-2 block">← Dashboard</Link>
            <h1 className="font-['Playfair_Display'] text-3xl text-[#F5F0E8]">Staff Users</h1>
            <p className="text-sm text-[#8A8070] mt-1">Manage admin and sales team accounts</p>
          </div>
          <Button onClick={() => setModalOpen(true)}>
            <UserPlus className="w-4 h-4" /> Add Staff
          </Button>
        </div>

        <div className="bg-[#1A1A1A] border border-[#C9A84C]/20 rounded-xl overflow-hidden">
          {isLoading ? (
            <div className="flex items-center justify-center py-16">
              <Loader2 className="w-6 h-6 animate-spin text-[#C9A84C]" />
            </div>
          ) : (
            <table className="w-full">
              <thead>
                <tr>
                  {['Name', 'Email', 'Role', 'Joined', 'Actions'].map((h) => (
                    <th key={h} className="table-th">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {users?.map((u) => (
                  <tr key={u.id} className="hover:bg-[#222]/60 transition-colors">
                    <td className="table-td text-[#F5F0E8] font-medium">{u.name}</td>
                    <td className="table-td">{u.email}</td>
                    <td className="table-td">
                      <span className={`text-xs px-2.5 py-0.5 rounded-full font-medium ${
                        u.role === 'admin'
                          ? 'bg-red-600/15 text-red-400 border border-red-600/25'
                          : 'bg-emerald-600/15 text-emerald-400 border border-emerald-600/25'
                      }`}>{u.role}</span>
                    </td>
                    <td className="table-td text-xs">{formatDate(u.createdAt)}</td>
                    <td className="table-td">
                      <button
                        onClick={() => deleteUser(u.id)}
                        className="p-1.5 rounded text-[#8A8070] hover:text-red-400 hover:bg-red-400/10 transition-all"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </main>

      {/* Add user modal */}
      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title="Add Staff Member">
        <div className="flex flex-col gap-4">
          <Input label="Full Name" placeholder="John Doe" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          <Input label="Email" type="email" placeholder="john@forall.et" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
          <Input label="Password" type="password" placeholder="Min 8 characters" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
          <Select label="Role" value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value as 'sales' | 'admin' })}>
            <option value="sales">Sales Team</option>
            <option value="admin">Admin</option>
          </Select>
          <div className="flex gap-3 pt-2">
            <Button variant="ghost" onClick={() => setModalOpen(false)} className="flex-1">Cancel</Button>
            <Button loading={isPending} onClick={() => createUser()} className="flex-1">Add Staff Member</Button>
          </div>
        </div>
      </Modal>
    </div>
  )
}
