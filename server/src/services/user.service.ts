import { z } from "zod"
import { UserModel } from "../models/user.model.js"
import { InterviewModel } from "../models/interview.model.js"
import { SubmissionModel } from "../models/submission.model.js"
import { ActivityModel } from "../models/activity.model.js"
import { hashPassword, comparePassword } from "../utils/hash.utils.js"

export const updateProfileSchema = z.object({
  name: z.string().min(2).max(100).optional(),
  githubUsername: z.string().max(50).optional().nullable(),
  leetcodeUsername: z.string().max(50).optional().nullable(),
  avatar: z.string().url("Invalid URL").optional().nullable(),
})

export const changePasswordSchema = z.object({
  currentPassword: z.string().min(1, "Current password required"),
  newPassword: z
    .string()
    .min(8, "Min 8 characters")
    .regex(/[A-Z]/, "Need uppercase")
    .regex(/[0-9]/, "Need number"),
})

export type UpdateProfileInput = z.infer<typeof updateProfileSchema>

export const getProfile = async (userId: string) => {
  const user = await UserModel.findById(userId).select("-password")
  if (!user) throw new Error("User not found")
  return user
}

export const updateProfile = async (
  userId: string,
  input: UpdateProfileInput
) => {
  const user = await UserModel.findByIdAndUpdate(
    userId,
    { $set: input },
    { new: true, runValidators: true }
  ).select("-password")

  if (!user) throw new Error("User not found")
  return user
}

export const changePassword = async (
  userId: string,
  currentPassword: string,
  newPassword: string
) => {
  const user = await UserModel.findById(userId).select("+password")
  if (!user || !user.password) throw new Error("User not found")

  const isMatch = await comparePassword(currentPassword, user.password)
  if (!isMatch) throw new Error("Current password is incorrect")

  user.password = await hashPassword(newPassword)
  await user.save()
}

export const deleteAccount = async (userId: string) => {
  await UserModel.findByIdAndUpdate(userId, { isActive: false })

  await Promise.all([
    InterviewModel.deleteMany({ user: userId }),
    SubmissionModel.deleteMany({ user: userId }),
    ActivityModel.deleteMany({ user: userId }),
  ])
}