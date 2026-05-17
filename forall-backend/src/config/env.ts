// src/config/env.ts
import dotenv from 'dotenv'
dotenv.config()

function required(key: string): string {
  const val = process.env[key]
  if (!val) throw new Error(`Missing required env variable: ${key}`)
  return val
}

function optional(key: string, fallback: string): string {
  return process.env[key] ?? fallback
}

const defaultPort = optional('PORT', '5000')

export const env = {
  NODE_ENV: optional('NODE_ENV', 'development'),
  PORT: parseInt(defaultPort),
  IS_PROD: process.env.NODE_ENV === 'production',

  DATABASE_URL: required('DATABASE_URL'),

  JWT_SECRET: required('JWT_SECRET'),
  JWT_EXPIRES_IN: optional('JWT_EXPIRES_IN', '1d'),
  JWT_REFRESH_SECRET: required('JWT_REFRESH_SECRET'),
  JWT_REFRESH_EXPIRES_IN: optional('JWT_REFRESH_EXPIRES_IN', '30d'),

  CLOUDINARY_CLOUD_NAME: optional('CLOUDINARY_CLOUD_NAME', ''),
  CLOUDINARY_API_KEY: optional('CLOUDINARY_API_KEY', ''),
  CLOUDINARY_API_SECRET: optional('CLOUDINARY_API_SECRET', ''),
  STORAGE_PROVIDER: optional('STORAGE_PROVIDER', 'cloudinary'),
  API_BASE_URL: optional('API_BASE_URL', `http://localhost:${defaultPort}`),

  SMTP_HOST: optional('SMTP_HOST', 'smtp.gmail.com'),
  SMTP_PORT: parseInt(optional('SMTP_PORT', '587')),
  SMTP_USER: optional('SMTP_USER', ''),
  SMTP_PASS: optional('SMTP_PASS', ''),
  EMAIL_FROM: optional('EMAIL_FROM', 'noreply@forall.et'),
  SALES_EMAIL: optional('SALES_EMAIL', 'sales@forall.et'),

  TWILIO_ACCOUNT_SID: optional('TWILIO_ACCOUNT_SID', ''),
  TWILIO_AUTH_TOKEN: optional('TWILIO_AUTH_TOKEN', ''),
  TWILIO_PHONE_NUMBER: optional('TWILIO_PHONE_NUMBER', ''),
  SALES_PHONE: optional('SALES_PHONE', ''),

  CLIENT_URL: optional('CLIENT_URL', 'http://localhost:3000'),
  BCRYPT_ROUNDS: parseInt(optional('BCRYPT_ROUNDS', '12')),
}
