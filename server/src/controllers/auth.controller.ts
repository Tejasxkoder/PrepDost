import type { Request, Response } from "express"
import {
  registerUser,
  loginUser,
  getUserProfile,
  registerSchema,
  loginSchema,
} from "../services/auth.service.js"
import { sendSuccess, sendError } from "../utils/response.utils.js"
import type { AuthRequest } from "../middlewares/auth.middleware.js"

export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const validation = registerSchema.safeParse(req.body)
    if (!validation.success) {
      const errors = validation.error.issues.reduce(
        (acc, issue) => {
          acc[issue.path[0] as string] = issue.message
          return acc
        },
        {} as Record<string, string>
      )
      sendError(res, "Validation failed", 400, errors)
      return
    }

    const { user, token } = await registerUser(validation.data)

    sendSuccess(res, "Account created successfully", { user, token }, 201)
  } catch (error) {
    const message = error instanceof Error ? error.message : "Registration failed"
    const statusCode = message.includes("already registered") ? 409 : 500
    sendError(res, message, statusCode)
  }
}

export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const validation = loginSchema.safeParse(req.body)
    if (!validation.success) {
      sendError(res, "Validation failed", 400)
      return
    }

    const { user, token } = await loginUser(validation.data)

    sendSuccess(res, "Login successful", { user, token })
  } catch (error) {
    const message = error instanceof Error ? error.message : "Login failed"
    sendError(res, message, 401)
  }
}

export const getMe = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const user = await getUserProfile(req.user!.id)
    sendSuccess(res, "Profile fetched", user)
  } catch (error) {
    sendError(res, "User not found", 404)
  }
}

export const logout = async (req: Request, res: Response): Promise<void> => {
  sendSuccess(res, "Logged out successfully")
}