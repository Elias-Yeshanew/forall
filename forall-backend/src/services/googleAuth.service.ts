import { env } from '../config/env'

export interface GoogleUserPayload {
  sub: string
  email: string
  name: string
  picture?: string
}

export async function verifyGoogleToken(idToken: string): Promise<GoogleUserPayload> {
  const url = `https://oauth2.googleapis.com/tokeninfo?id_token=${idToken}`
  const response = await fetch(url)
  if (!response.ok) {
    throw new Error('Invalid Google ID token')
  }

  const payload = (await response.json()) as any

  // Validate audience if client ID is configured
  if (env.GOOGLE_CLIENT_ID && payload.aud !== env.GOOGLE_CLIENT_ID) {
    throw new Error('Google authentication client ID mismatch')
  }

  // Validate issuer
  const validIssuers = ['accounts.google.com', 'https://accounts.google.com']
  if (!validIssuers.includes(payload.iss)) {
    throw new Error('Invalid token issuer')
  }

  // Check email verification status
  if (payload.email_verified !== 'true' && payload.email_verified !== true) {
    throw new Error('Google email is not verified')
  }

  return {
    sub: payload.sub,
    email: payload.email,
    name: payload.name,
    picture: payload.picture,
  }
}
