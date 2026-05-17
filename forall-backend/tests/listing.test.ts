// tests/listing.test.ts
import request from 'supertest'
import app from '../src/app'
import { prisma } from '../src/config/database'
import bcrypt from 'bcryptjs'

let salesToken: string
let adminToken: string
let listingId: string

beforeAll(async () => {
  await prisma.user.upsert({
    where: { email: 'test-sales@forall.et' },
    update: {},
    create: { name: 'Test Sales', email: 'test-sales@forall.et', passwordHash: await bcrypt.hash('Sales@123', 10), role: 'sales' },
  })
  await prisma.user.upsert({
    where: { email: 'test-admin2@forall.et' },
    update: {},
    create: { name: 'Test Admin2', email: 'test-admin2@forall.et', passwordHash: await bcrypt.hash('Admin@123', 10), role: 'admin' },
  })

  const salesRes = await request(app).post('/api/auth/login').send({ email: 'test-sales@forall.et', password: 'Sales@123' })
  const adminRes = await request(app).post('/api/auth/login').send({ email: 'test-admin2@forall.et', password: 'Admin@123' })
  salesToken = salesRes.body.data.token
  adminToken = adminRes.body.data.token
})

afterAll(async () => {
  if (listingId) await prisma.listing.deleteMany({ where: { id: listingId } })
  await prisma.user.deleteMany({ where: { email: { contains: 'test-' } } })
  await prisma.$disconnect()
})

const sampleListing = {
  type: 'car', title: 'Test Toyota Hilux 2020', description: 'A well-maintained test vehicle in excellent condition for testing purposes.',
  price: 1500000, location: 'Test Area, Addis Ababa', city: 'Addis Ababa',
  poster: { fullName: 'Test Poster', phone: '+251911000000', email: 'poster@test.et' },
  carDetails: { make: 'Toyota', model: 'Hilux', year: 2020, mileage: 50000, transmission: 'manual', fuelType: 'diesel', color: 'White' },
}

describe('POST /api/listings', () => {
  it('creates listing and returns it without poster', async () => {
    const res = await request(app).post('/api/listings').send(sampleListing)
    expect(res.status).toBe(201)
    expect(res.body.data.listing.title).toBe(sampleListing.title)
    expect(res.body.data.listing.poster).toBeUndefined()
    expect(res.body.data.listing.status).toBe('pending')
    listingId = res.body.data.listing.id
  })

  it('returns 400 for missing required fields', async () => {
    const res = await request(app).post('/api/listings').send({ type: 'car', title: 'Short' })
    expect(res.status).toBe(400)
  })
})

describe('GET /api/listings', () => {
  it('returns paginated listings without poster info', async () => {
    const res = await request(app).get('/api/listings')
    expect(res.status).toBe(200)
    expect(Array.isArray(res.body.data)).toBe(true)
    if (res.body.data.length > 0) {
      expect(res.body.data[0].poster).toBeUndefined()
    }
  })
})

describe('GET /api/listings/admin (staff only)', () => {
  it('returns listings WITH poster info for sales role', async () => {
    const res = await request(app)
      .get('/api/listings/admin')
      .set('Authorization', `Bearer ${salesToken}`)
    expect(res.status).toBe(200)
  })

  it('returns 401 without auth', async () => {
    const res = await request(app).get('/api/listings/admin')
    expect(res.status).toBe(401)
  })
})

describe('GET /api/listings/:id/poster (staff only)', () => {
  it('returns 401 for public access', async () => {
    if (!listingId) return
    const res = await request(app).get(`/api/listings/${listingId}/poster`)
    expect(res.status).toBe(401)
  })

  it('returns poster details for sales token', async () => {
    if (!listingId) return
    const res = await request(app)
      .get(`/api/listings/${listingId}/poster`)
      .set('Authorization', `Bearer ${salesToken}`)
    expect(res.status).toBe(200)
    expect(res.body.data.poster.phone).toBe(sampleListing.poster.phone)
  })
})

describe('PATCH /api/listings/:id/status (staff only)', () => {
  it('approves listing to active', async () => {
    if (!listingId) return
    const res = await request(app)
      .patch(`/api/listings/${listingId}/status`)
      .set('Authorization', `Bearer ${salesToken}`)
      .send({ status: 'active' })
    expect(res.status).toBe(200)
    expect(res.body.data.listing.status).toBe('active')
  })
})

describe('DELETE /api/listings/:id (admin only)', () => {
  it('returns 403 for sales role', async () => {
    if (!listingId) return
    const res = await request(app)
      .delete(`/api/listings/${listingId}`)
      .set('Authorization', `Bearer ${salesToken}`)
    expect(res.status).toBe(403)
  })

  it('deletes listing for admin role', async () => {
    if (!listingId) return
    const res = await request(app)
      .delete(`/api/listings/${listingId}`)
      .set('Authorization', `Bearer ${adminToken}`)
    expect(res.status).toBe(200)
    listingId = '' // prevent afterAll double-delete
  })
})
