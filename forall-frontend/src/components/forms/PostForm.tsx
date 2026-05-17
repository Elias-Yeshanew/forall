'use client'
// src/components/forms/PostForm.tsx
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { createListingSchema, CreateListingFormData } from '@/lib/validations'
import { Input, Select, Textarea } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { useCreateListing } from '@/hooks/useListings'
import { Car, Home, Shield, CheckCircle2, ChevronRight } from 'lucide-react'
import { cn } from '@/lib/utils'
import { listingsApi } from '@/lib/api'
import toast from 'react-hot-toast'
import { useTranslation } from 'react-i18next'
import { useAuth } from '@/context/AuthContext'
import { useRouter } from 'next/navigation'

const SECTION = ({ title, children }: { title: React.ReactNode; children: React.ReactNode }) => (
  <div className="bg-[#1A1A1A] border border-[#C9A84C]/20 rounded-xl p-6">
    <h3 className="text-[10px] text-[#C9A84C] uppercase tracking-[3px] mb-5 pb-3 border-b border-[#C9A84C]/15">
      {title}
    </h3>
    {children}
  </div>
)

export function PostForm() {
  const [listingType, setListingType] = useState<'car' | 'house'>('car')
  const [isSuccess, setIsSuccess] = useState(false)
  const [selectedImages, setSelectedImages] = useState<File[]>([])
  const [previewUrls, setPreviewUrls] = useState<string[]>([])
  const { mutateAsync, isPending } = useCreateListing()
  const { t } = useTranslation('post')
  const { isAuthenticated, isLoading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      toast.error('Please log in or register to post a listing')
      router.replace('/login')
    }
  }, [isLoading, isAuthenticated, router])

  useEffect(() => {
    const urls = selectedImages.map((file) => URL.createObjectURL(file))
    setPreviewUrls(urls)

    return () => {
      urls.forEach((url) => URL.revokeObjectURL(url))
    }
  }, [selectedImages])

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<CreateListingFormData>({
    resolver: zodResolver(createListingSchema),
    defaultValues: { 
      type: 'car',
      carDetails: {
        transmission: 'automatic',
        fuelType: 'petrol',
      },
      houseDetails: {
        propertyType: 'villa',
        saleType: 'for_sale',
        furnished: false,
      }
    },
    shouldUnregister: true,
  })

  const handleTypeSelect = (type: 'car' | 'house') => {
    setListingType(type)
    setValue('type', type)
  }

  const onSubmit = async (data: CreateListingFormData) => {
    try {
      let imageUrls: string[] = []
      if (selectedImages.length) {
        imageUrls = await listingsApi.uploadImages(selectedImages, data.title)
      }

      await mutateAsync({
        ...data,
        price: Number(data.price),
        images: imageUrls,
      })
      setIsSuccess(true)
      setSelectedImages([])
      reset()
    } catch {
      toast.error('Failed to submit listing. Please try again.')
    }
  }

  const handleImageSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const incoming = Array.from(event.target.files ?? [])
    if (!incoming.length) return

    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
    const valid = incoming.filter((file) => allowedTypes.includes(file.type) && file.size <= 5 * 1024 * 1024)

    if (valid.length !== incoming.length) {
      toast.error('Only JPG/PNG/WebP images up to 5MB are allowed.')
    }

    setSelectedImages((prev) => {
      const next = [...prev, ...valid].slice(0, 8)
      if (prev.length + valid.length > 8) {
        toast.error('You can upload up to 8 images.')
      }
      return next
    })

    event.target.value = ''
  }

  const removeImage = (index: number) => {
    setSelectedImages((prev) => prev.filter((_, i) => i !== index))
  }

  if (isSuccess) {
    return (
      <div className="max-w-lg mx-auto text-center py-16 flex flex-col items-center gap-5">
        <CheckCircle2 className="w-16 h-16 text-[#C9A84C]" />
        <div>
          <h2 className="font-['Playfair_Display'] text-2xl text-[#F5F0E8] mb-3">{t('submitSuccess', 'Listing Submitted!')}</h2>
          <p className="text-[#8A8070] text-sm leading-relaxed">
            {t('privacy', 'Our sales team will review your listing and publish it shortly.')}
          </p>
        </div>
        <Button onClick={() => setIsSuccess(false)}>Post Another Listing</Button>
      </div>
    )
  }

  if (isLoading || !isAuthenticated) return null;

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="max-w-2xl mx-auto flex flex-col gap-6">
      {/* Header */}
      <div className="text-center mb-2">
        <div className="text-xs text-[#C9A84C] uppercase tracking-[4px] mb-3">{t('title', 'New Listing')}</div>
        <h1 className="font-['Playfair_Display'] text-3xl text-[#F5F0E8] mb-2">
          {t('title', 'Post a Listing')}
        </h1>
        <p className="text-sm text-[#8A8070]">
          {t('subtitle', 'Anyone can post. Your contact details remain private.')}
        </p>
      </div>

      {/* Type selector */}
      <SECTION title={t('type', 'Listing Type')}>
        <div className="grid grid-cols-2 gap-3">
          {[
            { type: 'car' as const, icon: <Car className="w-5 h-5" />, label: t('car', 'Car') },
            { type: 'house' as const, icon: <Home className="w-5 h-5" />, label: t('house', 'House / Property') },
          ].map((opt) => (
            <button
              key={opt.type}
              type="button"
              onClick={() => handleTypeSelect(opt.type)}
              className={cn(
                'flex flex-col items-center gap-2 p-5 rounded-xl border transition-all duration-200',
                listingType === opt.type
                  ? 'border-[#C9A84C] bg-[#C9A84C]/8 text-[#C9A84C]'
                  : 'border-[#C9A84C]/20 text-[#8A8070] hover:border-[#C9A84C]/40 hover:text-[#C8C0B0]'
              )}
            >
              {opt.icon}
              <span className="text-sm font-medium">{opt.label}</span>
            </button>
          ))}
        </div>
      </SECTION>

      {/* Basic info */}
      <SECTION title={t('basicInfo', 'Basic Information')}>
        <div className="flex flex-col gap-4">
          <Input
            required
            label={t('listingTitle', 'Title')}
            placeholder={t('titlePlaceholder', 'e.g. Toyota Land Cruiser 2020')}
            error={errors.title?.message}
            {...register('title')}
          />
          <div className="grid grid-cols-2 gap-4">
            <Input
              required
              label={t('price', 'Price (ETB)')}
              type="number"
              placeholder={t('pricePlaceholder', '3,500,000')}
              error={errors.price?.message}
              {...register('price')}
            />
            <Input
              required
              label={t('city', 'City')}
              placeholder="Addis Ababa"
              error={errors.city?.message}
              {...register('city')}
            />
          </div>
          <Input
            required
            label={t('location', 'Location')}
            placeholder={t('locationPlaceholder', 'Bole, Addis Ababa')}
            error={errors.location?.message}
            {...register('location')}
          />
          <Textarea
            required
            label={t('description', 'Description')}
            rows={4}
            placeholder={t('descriptionPlaceholder', 'Describe your listing in detail...')}
            error={errors.description?.message}
            {...register('description')}
          />
        </div>
      </SECTION>

      {/* Car details */}
      {listingType === 'car' && (
        <SECTION title={t('carDetails', 'Car Details')}>
          <div className="flex flex-col gap-4">
            <div className="grid grid-cols-2 gap-4">
              <Input
                required
                label={t('make', 'Make')}
                placeholder="Toyota, BMW, Mercedes..."
                error={errors.carDetails?.make?.message}
                {...register('carDetails.make')}
              />
              <Input
                required
                label={t('model', 'Model')}
                placeholder="Land Cruiser, X5..."
                error={errors.carDetails?.model?.message}
                {...register('carDetails.model')}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <Input
                required
                label={t('year', 'Year')}
                type="number"
                placeholder="2022"
                error={errors.carDetails?.year?.message}
                {...register('carDetails.year')}
              />
              <Input
                required
                label={t('mileage', 'Mileage (km)')}
                type="number"
                placeholder="45,000"
                error={errors.carDetails?.mileage?.message}
                {...register('carDetails.mileage')}
              />
            </div>
            <div className="grid grid-cols-3 gap-4">
              <Select
                required
                label={t('transmission', 'Transmission')}
                error={errors.carDetails?.transmission?.message}
                {...register('carDetails.transmission')}
              >
                <option value="">Select</option>
                <option value="automatic">Automatic</option>
                <option value="manual">Manual</option>
              </Select>
              <Select
                required
                label={t('fuelType', 'Fuel Type')}
                error={errors.carDetails?.fuelType?.message}
                {...register('carDetails.fuelType')}
              >
                <option value="">Select</option>
                <option value="petrol">Petrol</option>
                <option value="diesel">Diesel</option>
                <option value="electric">Electric</option>
                <option value="hybrid">Hybrid</option>
              </Select>
              <Input
                required
                label={t('color', 'Color')}
                placeholder="Black"
                error={errors.carDetails?.color?.message}
                {...register('carDetails.color')}
              />
            </div>
          </div>
        </SECTION>
      )}

      {/* House details */}
      {listingType === 'house' && (
        <SECTION title={t('houseDetails', 'Property Details')}>
          <div className="flex flex-col gap-4">
            <div className="grid grid-cols-2 gap-4">
              <Select
                required
                label={t('propertyType', 'Property Type')}
                error={errors.houseDetails?.propertyType?.message}
                {...register('houseDetails.propertyType')}
              >
                <option value="">Select</option>
                <option value="villa">Villa</option>
                <option value="apartment">Apartment</option>
                <option value="house">House</option>
                <option value="studio">Studio</option>
                <option value="commercial">Commercial</option>
              </Select>
              <Select
                required
                label={t('saleType', 'Sale Type')}
                error={errors.houseDetails?.saleType?.message}
                {...register('houseDetails.saleType')}
              >
                <option value="">Select</option>
                <option value="for_sale">For Sale / ለሽያጭ</option>
                <option value="for_rent">For Rent / ለኪራይ</option>
              </Select>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <Input
                required
                label={t('bedrooms', 'Bedrooms')}
                type="number"
                placeholder="3"
                error={errors.houseDetails?.bedrooms?.message}
                {...register('houseDetails.bedrooms')}
              />
              <Input
                required
                label={t('bathrooms', 'Bathrooms')}
                type="number"
                placeholder="2"
                error={errors.houseDetails?.bathrooms?.message}
                {...register('houseDetails.bathrooms')}
              />
              <Input
                required
                label={t('area', 'Area (m²)')}
                type="number"
                placeholder="180"
                error={errors.houseDetails?.areaSqm?.message}
                {...register('houseDetails.areaSqm')}
              />
            </div>
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                className="w-4 h-4 accent-[#C9A84C]"
                {...register('houseDetails.furnished')}
              />
              <span className="text-sm text-[#C8C0B0]">Furnished / የተገጠመ</span>
            </label>
          </div>
        </SECTION>
      )}

      <SECTION title={<span>{t('images', 'Upload Images')} <span className="text-red-500">*</span></span>}>
        <div className="flex flex-col gap-4">
          <div className="text-xs text-[#8A8070]">
            Upload up to 8 images (JPG, PNG, WebP, max 5MB each).
          </div>
          <input
            type="file"
            accept="image/jpeg,image/jpg,image/png,image/webp"
            multiple
            onChange={handleImageSelect}
            className="text-sm text-[#C8C0B0] file:mr-3 file:rounded-lg file:border file:border-[#C9A84C]/30 file:bg-[#111] file:px-3 file:py-2 file:text-[#C9A84C] hover:file:border-[#C9A84C]"
          />

          {!!previewUrls.length && (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {previewUrls.map((url, index) => (
                <div key={url} className="relative border border-[#C9A84C]/20 rounded-lg overflow-hidden">
                  <img src={url} alt={`Preview ${index + 1}`} className="h-28 w-full object-cover" />
                  <button
                    type="button"
                    onClick={() => removeImage(index)}
                    className="absolute top-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded"
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </SECTION>

      {Object.keys(errors).length > 0 && (
        <div className="text-red-400 text-sm bg-red-950/30 p-3 rounded-lg border border-red-500/20 text-center">
          Please fix the validation errors above before submitting.
        </div>
      )}

      <Button type="submit" loading={isPending} size="lg" className="w-full">
        {t('submitBtn', 'Submit Listing')}
        <ChevronRight className="w-4 h-4" />
      </Button>
    </form>
  )
}
