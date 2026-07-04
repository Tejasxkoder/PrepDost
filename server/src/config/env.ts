import dotenv from "dotenv"
import { z } from "zod"

dotenv.config()

const envSchema = z.object({
  NODE_ENV: z
    .enum(["development", "production", "test"])
    .default("development"),

  PORT: z.coerce.number().default(5000),

  MONGODB_URI: z.string().min(1, "MONGODB_URI is required"),

  JWT_SECRET: z
    .string()
    .min(32, "JWT_SECRET must be at least 32 characters"),

  JWT_EXPIRES_IN: z.string().default("7d"),

  FRONTEND_URL: z
    .string()
    .default("http://localhost:3000"),

  OPENROUTER_API_KEY: z
    .string()
    .min(1, "OPENROUTER_API_KEY is required"),

  DEEPGRAM_API_KEY: z
    .string()
    .min(1, "DEEPGRAM_API_KEY is required"),

})

const parsed = envSchema.safeParse(process.env)

if (!parsed.success) {
  console.error(" Invalid environment variables")

  for (const issue of parsed.error.issues) {
    console.error(
      `• ${issue.path.join(".")}: ${issue.message}`
    )
  }

  process.exit(1)
}

export const ENV = parsed.data