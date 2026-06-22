import jwt, { SignOptions } from "jsonwebtoken"

const JWT_SECRET = process.env.JWT_SECRET

if (!JWT_SECRET) {
  throw new Error(
    "JWT_SECRET is not defined in environment variables"
  )
}

const JWT_EXPIRES_IN =
  (process.env.JWT_EXPIRES_IN || "7d") as SignOptions["expiresIn"]

export interface JWTPayload {
  id: string
  email: string
  role: string
}

export const generateToken = (
  payload: JWTPayload
): string => {
  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: JWT_EXPIRES_IN,
  })
}

export const verifyToken = (
  token: string
): JWTPayload => {
  return jwt.verify(
    token,
    JWT_SECRET
  ) as JWTPayload
}