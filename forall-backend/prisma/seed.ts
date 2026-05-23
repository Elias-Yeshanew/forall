import bcrypt from 'bcryptjs'
import prisma from '../src/config/database'

async function main() {
  console.log('🌱 Seeding database...')

  // ─── USERS ────────────────────────────────────────────────────────────────
  const adminPass = await bcrypt.hash('Admin@123', 12)
  const salesPass = await bcrypt.hash('Sales@123', 12)

  const admin = await prisma.user.upsert({
    where: { email: 'admin@forall.et' },
    update: {},
    create: { name: 'Admin User', email: 'admin@forall.et', passwordHash: adminPass, role: 'admin' },
  })

  const sales1 = await prisma.user.upsert({
    where: { email: 'sales1@forall.et' },
    update: {},
    create: { name: 'Tigist Bekele', email: 'sales1@forall.et', passwordHash: salesPass, role: 'sales' },
  })

  const sales2 = await prisma.user.upsert({
    where: { email: 'sales2@forall.et' },
    update: {},
    create: { name: 'Dawit Haile', email: 'sales2@forall.et', passwordHash: salesPass, role: 'sales' },
  })

  console.log(`✅ Users: admin (${admin.email}), ${sales1.name}, ${sales2.name}`)

  // ─── LISTINGS ─────────────────────────────────────────────────────────────
  const listingsData = [
    {
      listing: {
        type: 'car' as const, title: 'Toyota Land Cruiser V8 — Full Option',
        slug: 'toyota-land-cruiser-v8-full-option-1',
        description: 'Immaculate 2021 Land Cruiser V8. Full option with sunroof, leather seats, and all modern safety features. Single owner, serviced at authorized Toyota center.',
        price: 4800000, location: 'Bole, Addis Ababa', city: 'Addis Ababa', status: 'active' as const,
        images: ['https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=900&q=80'],
      },
      poster: { fullName: 'Abebe Bekele', phone: '+251 911 234 567', email: 'abebe@gmail.com' },
      carDetails: { make: 'Toyota', model: 'Land Cruiser', year: 2021, mileage: 38000, transmission: 'automatic' as const, fuelType: 'petrol' as const, color: 'Pearl White' },
    },
    {
      listing: {
        type: 'house' as const, title: 'Luxury Villa with Pool — CMC Area',
        slug: 'luxury-villa-with-pool-cmc-area-2',
        description: 'Stunning 5-bedroom luxury villa in CMC. Features swimming pool, spacious garden, modern kitchen, and 24/7 security. Built with premium imported materials.',
        price: 12500000, location: 'CMC, Addis Ababa', city: 'Addis Ababa', status: 'active' as const,
        images: ['https://images.unsplash.com/photo-1613977257363-707ba9348227?w=900&q=80'],
      },
      poster: { fullName: 'Sara Tadesse', phone: '+251 922 345 678', email: 'sara@email.com' },
      houseDetails: { propertyType: 'villa' as const, saleType: 'for_sale' as const, bedrooms: 5, bathrooms: 4, areaSqm: 420, furnished: true },
    },
    {
      listing: {
        type: 'car' as const, title: 'BMW X5 xDrive40i M Sport',
        slug: 'bmw-x5-xdrive40i-m-sport-3',
        description: '2022 BMW X5 xDrive40i in Alpine White. M Sport package with 22" alloys, panoramic roof, Harman Kardon sound. Imported directly from Germany.',
        price: 6200000, location: 'Kazanchis, Addis Ababa', city: 'Addis Ababa', status: 'active' as const,
        images: ['https://images.unsplash.com/photo-1555215695-3004980ad54e?w=900&q=80'],
      },
      poster: { fullName: 'Dawit Mengistu', phone: '+251 933 456 789', email: 'dawit@business.et' },
      carDetails: { make: 'BMW', model: 'X5 xDrive40i', year: 2022, mileage: 12000, transmission: 'automatic' as const, fuelType: 'petrol' as const, color: 'Alpine White' },
    },
    {
      listing: {
        type: 'house' as const, title: 'Modern 3-Bed Apartment — Bole Road',
        slug: 'modern-3-bed-apartment-bole-road-4',
        description: 'Elegant 3-bedroom apartment on the 8th floor with panoramic city views. Open-plan living, modern fitted kitchen, master suite. Building has gym and underground parking.',
        price: 2800000, location: 'Bole Road, Addis Ababa', city: 'Addis Ababa', status: 'pending' as const,
        images: ['https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=900&q=80'],
      },
      poster: { fullName: 'Hana Girma', phone: '+251 944 567 890', email: 'hana@email.com' },
      houseDetails: { propertyType: 'apartment' as const, saleType: 'for_sale' as const, bedrooms: 3, bathrooms: 2, areaSqm: 185, furnished: false },
    },
    {
      listing: {
        type: 'car' as const, title: 'Mercedes-Benz GLE 450 AMG Line',
        slug: 'mercedes-benz-gle-450-amg-line-5',
        description: 'Brand new 2023 GLE 450 AMG Line in Obsidian Black. 3.0L turbo, 367 HP, Burmester audio, MBUX, 360° camera. First owner.',
        price: 8900000, location: 'Old Airport, Addis Ababa', city: 'Addis Ababa', status: 'active' as const,
        images: ['https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=900&q=80'],
      },
      poster: { fullName: 'Yonas Alemu', phone: '+251 955 678 901', email: 'yonas@alemu.et' },
      carDetails: { make: 'Mercedes-Benz', model: 'GLE 450', year: 2023, mileage: 5000, transmission: 'automatic' as const, fuelType: 'petrol' as const, color: 'Obsidian Black' },
    },
    {
      listing: {
        type: 'house' as const, title: '4-Bed Family Home — Summit Area',
        slug: '4-bed-family-home-summit-area-6',
        description: 'Charming 4-bedroom home in quiet Summit neighborhood. Large walled garden, double garage, recently renovated kitchen. Near international schools.',
        price: 7400000, location: 'Summit, Addis Ababa', city: 'Addis Ababa', status: 'active' as const,
        images: ['https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=900&q=80'],
      },
      poster: { fullName: 'Meron Kebede', phone: '+251 966 789 012', email: 'meron@email.com' },
      houseDetails: { propertyType: 'house' as const, saleType: 'for_sale' as const, bedrooms: 4, bathrooms: 3, areaSqm: 310, furnished: false },
    },
  ]

  for (const item of listingsData) {
    const existing = await prisma.listing.findUnique({ where: { slug: item.listing.slug } })
    if (existing) continue

    const listing = await prisma.listing.create({
      data: {
        ...item.listing,
        price: item.listing.price,
        poster: { create: item.poster },
        ...(item.carDetails && { carDetails: { create: item.carDetails } }),
        ...(item.houseDetails && { houseDetails: { create: item.houseDetails } }),
      },
    })
    console.log(`  ✅ Listing: ${listing.title}`)
  }

  // ─── SAMPLE CONTACTS ──────────────────────────────────────────────────────
  const firstListing = await prisma.listing.findFirst({ where: { status: 'active' } })
  if (firstListing) {
    const contactCount = await prisma.contact.count({ where: { listingId: firstListing.id } })
    if (contactCount === 0) {
      await prisma.contact.createMany({
        data: [
          { name: 'Tigist Haile', phone: '+251 912 111 222', message: 'Very interested. Can we arrange a viewing?', listingId: firstListing.id, status: 'unread' },
          { name: 'Kebede Worku', phone: '+251 923 222 333', email: 'kebede@email.com', message: 'What is the final price? Can we negotiate?', listingId: firstListing.id, status: 'replied' },
        ],
      })
      console.log('  ✅ Sample contacts created')
    }
  }

  console.log('\n🎉 Seed complete!')
  console.log('─────────────────────────────────────')
  console.log('  Admin login:  admin@forall.et  / Admin@123')
  console.log('  Sales login:  sales1@forall.et / Sales@123')
  console.log('─────────────────────────────────────')
}

main()
  .catch((e) => { console.error(e); process.exit(1) })
  .finally(() => prisma.$disconnect())
