import { z } from "zod"
import { UserModel } from "../models/user.model.js"
import {
  hashPassword,
  comparePassword,
} from "../utils/hash.utils.js"
import {
  generateToken,
} from "../utils/jwt.utils.js"

export const registerSchema = z.object({
  name: z
    .string()
    .min(2)
    .max(100),

  email: z
    .string()
    .email()
    .toLowerCase(),

  password: z
    .string()
    .min(8)
    .regex(/[A-Z]/)
    .regex(/[0-9]/),
})

export const loginSchema = z.object({
  email: z
    .string()
    .email()
    .toLowerCase(),

  password: z
    .string()
    .min(1),
})

export type RegisterInput =
  z.infer<typeof registerSchema>

export type LoginInput =
  z.infer<typeof loginSchema>

export const registerUser = async (
  input: RegisterInput
) => {
  const existingUser =
    await UserModel.findOne({
      email: input.email,
    })

  if (existingUser) {
    throw new Error(
      "Email already registered"
    )
  }

  const hashedPassword =
    await hashPassword(
      input.password
    )

  const user =
    await UserModel.create({
      name: input.name,
      email: input.email,
      password: hashedPassword,
    })

  const token =
    generateToken({
      id: user._id.toString(),
      email: user.email,
      role: user.role,
    })

  return {
    user,
    token,
  }
}

export const loginUser = async (
  input: LoginInput
) => {
  const user =
    await UserModel.findOne({
      email: input.email,
    }).select("+password")

  if (!user || !user.password) {
    throw new Error(
      "Invalid email or password"
    )
  }

  if (!user.isActive) {
    throw new Error(
      "Account is deactivated"
    )
  }

  const isMatch =
    await comparePassword(
      input.password,
      user.password
    )

  if (!isMatch) {
    throw new Error(
      "Invalid email or password"
    )
  }

  user.lastLoginAt = new Date()
  await user.save()

  const token =
    generateToken({
      id: user._id.toString(),
      email: user.email,
      role: user.role,
    })

  return {
    user: user.toJSON(),
    token,
  }
}

export const getUserProfile = async (
  userId: string
) => {
  const user =
    await UserModel.findById(userId)

  if (!user) {
    throw new Error(
      "User not found"
    )
  }

  return user
}