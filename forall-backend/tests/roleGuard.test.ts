// tests/roleGuard.test.ts
import request from 'supertest'
import app from '../src/app'
import { prisma } from '../src/config/database'
import bcrypt from 'bcryptjs'

let salesToken: string
let adminToken: string

beforeAll(async () => {
  await prisma.user.upsert({
    where: { email: 'rg-sales@forall.et' },
    update: {},
    create: { name: 'RG Sales', email: 'rg-sales@forall.et', passwordHash: await bcrypt.hash('Sales@123', 10), role: 'sales' },
  })
  await prisma.user.upsert({
    where: { email: 'rg-admin@forall.et' },
    update: {},
    create: { name: 'RG Admin', email: 'rg-admin@forall.et', passwordHash: await bcrypt.hash('Admin@123', 10), role: 'admin' },
  })

  const sRes = await request(app).post('/api/auth/login').send({ email: 'rg-sales@forall.et', password: 'Sales@123' })
  const aRes = await request(app).post('/api/auth/login').send({ email: 'rg-admin@forall.et', password: 'Admin@123' })
  salesToken = sRes.body.data.token
  adminToken = aRes.body.data.token
})

afterAll(async () => {
  await prisma.user.deleteMany({ where: { email: { contains: 'rg-' } } })
  await prisma.$disconnect()
})

describe('Role Guard — /api/users (admin only)', () => {
  it('blocks public access', async () => {
    const res = await request(app).get('/api/users')
    expect(res.status).toBe(401)
  })

  it('blocks sales role', async () => {
    const res = await request(app)
      .get('/api/users')
      .set('Authorization', `Bearer ${salesToken}`)
    expect(res.status).toBe(403)
  })

  it('allows admin role', async () => {
    const res = await request(app)
      .get('/api/users')
      .set('Authorization', `Bearer ${adminToken}`)
    expect(res.status).toBe(200)
  })
})

describe('Role Guard — /api/contacts (staff only)', () => {
  it('blocks public access', async () => {
    const res = await request(app).get('/api/contacts')
    expect(res.status).toBe(401)
  })

  it('allows sales role', async () => {
    const res = await request(app)
      .get('/api/contacts')
      .set('Authorization', `Bearer ${salesToken}`)
    expect(res.status).toBe(200)
  })

  it('allows admin role', async () => {
    const res = await request(app)
      .get('/api/contacts')
      .set('Authorization', `Bearer ${adminToken}`)
    expect(res.status).toBe(200)
  })
})
