// src/controllers/auth.controller.ts
import { Request, Response, NextFunction } from 'express'
import { loginService, refreshTokenService, getMeService, registerService } from '../services/auth.service'

export async function register(req: Request, res: Response, next: NextFunction) {
  try {
    const { name, email, password, phone } = req.body
    const { user, tokens } = await registerService(name, email, password, phone)

    res.cookie('refreshToken', tokens.refreshToken, {
      httpOnly: true, secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict', maxAge: 30 * 24 * 60 * 60 * 1000,
    })

    res.status(201).json({ status: 'success', data: { user, token: tokens.accessToken } })
  } catch (err) { next(err) }
}

export async function login(req: Request, res: Response, next: NextFunction) {
  try {
    const { email, password } = req.body
    const { user, tokens } = await loginService(email, password)

    res.cookie('refreshToken', tokens.refreshToken, {
      httpOnly: true, secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict', maxAge: 30 * 24 * 60 * 60 * 1000,
    })

    res.json({ status: 'success', data: { user, token: tokens.accessToken } })
  } catch (err) { next(err) }
}

export async function refresh(req: Request, res: Response, next: NextFunction) {
  try {
    const refreshToken = req.cookies?.refreshToken || req.body.refreshToken
    if (!refreshToken) return res.status(401).json({ status: 'error', message: 'Refresh token required' })

    const { user, tokens } = await refreshTokenService(refreshToken)

    res.cookie('refreshToken', tokens.refreshToken, {
      httpOnly: true, secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict', maxAge: 30 * 24 * 60 * 60 * 1000,
    })

    res.json({ status: 'success', data: { user, token: tokens.accessToken } })
  } catch (err) { next(err) }
}

export async function logout(req: Request, res: Response, next: NextFunction) {
  try {
    res.clearCookie('refreshToken')
    res.json({ status: 'success', message: 'Logged out successfully' })
  } catch (err) { next(err) }
}

export async function getMe(req: Request, res: Response, next: NextFunction) {
  try {
    const user = await getMeService(req.user!.id)
    res.json({ status: 'success', data: { user } })
  } catch (err) { next(err) }
}
