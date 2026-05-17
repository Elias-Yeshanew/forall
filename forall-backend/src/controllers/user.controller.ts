// src/controllers/user.controller.ts
import { Request, Response, NextFunction } from 'express'
import {
  getAllUsersService, createUserService,
  updateUserService, deleteUserService,
} from '../services/user.service'

export async function getUsers(req: Request, res: Response, next: NextFunction) {
  try {
    const users = await getAllUsersService()
    res.json({ status: 'success', data: { users } })
  } catch (err) { next(err) }
}

export async function createUser(req: Request, res: Response, next: NextFunction) {
  try {
    const user = await createUserService(req.body)
    res.status(201).json({ status: 'success', data: { user } })
  } catch (err) { next(err) }
}

export async function updateUser(req: Request, res: Response, next: NextFunction) {
  try {
    const user = await updateUserService(req.params.id, req.body)
    res.json({ status: 'success', data: { user } })
  } catch (err) { next(err) }
}

export async function deleteUser(req: Request, res: Response, next: NextFunction) {
  try {
    await deleteUserService(req.params.id)
    res.json({ status: 'success', message: 'User deleted successfully' })
  } catch (err) { next(err) }
}
