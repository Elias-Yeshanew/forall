// tests/auth.test.ts
import request from 'supertest'
import app from '../src/app'
import { prisma } from '../src/config/database'
import bcrypt from 'bcryptjs'

let adminToken: string

beforeAll(async () => {
  // Create test admin user
  await prisma.user.upsert({
    where: { email: 'test-admin@forall.et' },
    update: {},
    create: {
      name: 'Test Admin', email: 'test-admin@forall.et',
      passwordHash: await bcrypt.hash('Admin@123', 10), role: 'admin',
    },
  })
})

afterAll(async () => {
  await prisma.user.deleteMany({ where: { email: { contains: 'test-' } } })
  await prisma.$disconnect()
})

describe('POST /api/auth/login', () => {
  it('returns token for valid credentials', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: 'test-admin@forall.et', password: 'Admin@123' })

    expect(res.status).toBe(200)
    expect(res.body.data.token).toBeDefined()
    expect(res.body.data.user.role).toBe('admin')
    adminToken = res.body.data.token
  })

  it('returns 401 for wrong password', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: 'test-admin@forall.et', password: 'wrongpassword' })
    expect(res.status).toBe(401)
  })

  it('returns 400 for invalid email format', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: 'not-an-email', password: 'password' })
    expect(res.status).toBe(400)
  })
})

describe('GET /api/auth/me', () => {
  it('returns user for valid token', async () => {
    const res = await request(app)
      .get('/api/auth/me')
      .set('Authorization', `Bearer ${adminToken}`)
    expect(res.status).toBe(200)
    expect(res.body.data.user.email).toBe('test-admin@forall.et')
  })

  it('returns 401 without token', async () => {
    const res = await request(app).get('/api/auth/me')
    expect(res.status).toBe(401)
  })
})
