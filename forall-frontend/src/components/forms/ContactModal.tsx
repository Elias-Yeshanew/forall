'use client'
// src/components/forms/ContactModal.tsx
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { contactSchema, ContactFormData } from '@/lib/validations'
import { Modal } from '@/components/ui/Modal'
import { Input, Textarea } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { useSubmitContact } from '@/hooks/useContacts'
import { Listing } from '@/types/listing'
import toast from 'react-hot-toast'
import { CheckCircle2, Shield } from 'lucide-react'

interface ContactModalProps {
  open: boolean
  onClose: () => void
  listing: Listing
}

export function ContactModal({ open, onClose, listing }: ContactModalProps) {
  const { mutateAsync, isPending, isSuccess } = useSubmitContact()

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
    defaultValues: { listingId: listing.id },
  })

  const onSubmit = async (data: ContactFormData) => {
    try {
      await mutateAsync(data)
      toast.success('Message sent! Our team will reach you within 24 hours.')
    } catch {
      toast.error('Failed to send message. Please try again.')
    }
  }

  const handleClose = () => {
    reset()
    onClose()
  }

  return (
    <Modal
      open={open}
      onClose={handleClose}
      title="Contact Sales Team / ሽያጭ ቡድን ያነጋግሩ"
    >
      {isSuccess ? (
        <div className="text-center py-6 flex flex-col items-center gap-4">
          <CheckCircle2 className="w-14 h-14 text-emerald-400" />
          <div>
            <p className="font-['Playfair_Display'] text-lg text-[#F5F0E8] mb-2">Message Sent!</p>
            <p className="text-sm text-[#8A8070]">Our sales team will contact you within 24 hours.</p>
            <p className="text-sm text-[#8A8070]">ቡድናችን በ24 ሰዓት ውስጥ ያነጋግርዎታል።</p>
          </div>
          <Button variant="outline" onClick={handleClose}>Close</Button>
        </div>
      ) : (
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
          {/* Listing info */}
          <div className="bg-[#222] border border-[#C9A84C]/20 rounded-lg p-3">
            <p className="text-xs text-[#8A8070] mb-1">Inquiring about / ስለዚህ ይጠይቃሉ</p>
            <p className="text-sm font-medium text-[#C9A84C]">{listing.title}</p>
          </div>

          {/* Privacy note */}
          <div className="flex items-start gap-2 text-xs text-[#8A8070] bg-[#1A1A1A] border border-[#C9A84C]/10 rounded-lg p-3">
            <Shield className="w-4 h-4 flex-shrink-0 text-[#C9A84C] mt-0.5" />
            <span>Our sales team will connect you with the seller. Poster contact info is kept private. / የሰጪ ግንኙነት ሚስጥራዊ ሆኖ ይቆያል።</span>
          </div>

          <input type="hidden" {...register('listingId')} />

          <Input
            label="Your Name / ስምዎ"
            placeholder="Tigist Haile"
            error={errors.name?.message}
            {...register('name')}
          />

          <Input
            label="Phone Number / ስልክ ቁጥር"
            placeholder="+251 9XX XXX XXX"
            error={errors.phone?.message}
            {...register('phone')}
          />

          <Input
            label="Email (optional) / ኢሜይል"
            type="email"
            placeholder="you@email.com"
            error={errors.email?.message}
            {...register('email')}
          />

          <Textarea
            label="Message / መልዕክት"
            rows={4}
            placeholder="I am interested in this listing. Please contact me..."
            error={errors.message?.message}
            {...register('message')}
          />

          <div className="flex gap-3 pt-1">
            <Button type="button" variant="ghost" onClick={handleClose} className="flex-1">
              Cancel
            </Button>
            <Button type="submit" loading={isPending} className="flex-1">
              Send to Sales Team / ላክ
            </Button>
          </div>
        </form>
      )}
    </Modal>
  )
}
