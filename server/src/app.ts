import express from "express"
import type { Express, Request, Response } from "express"
import cors from "cors"
import authRouter from "./routes/auth.route.js"
import interviewRouter from "./routes/interview.route.js"
import problemRouter from "./routes/problem.route.js"
import submissionRouter from "./routes/submission.route.js"
import userRouter from "./routes/user.route.js"

const app: Express = express()

app.use(express.json({ limit: "10mb" }))
app.use(express.urlencoded({ extended: true }))
app.use(
  cors({
    origin:
      process.env.NODE_ENV === "production"
        ? process.env.FRONTEND_URL
        : ["http://localhost:3000"],
    credentials: true,
  })
)

app.get("/api/v1/health", (_req: Request, res: Response) => {
  res.json({ success: true, message: "PrepDost API running" })
})

app.use("/api/v1/auth", authRouter)

app.use("/api/v1/interviews", interviewRouter)

app.use("/api/v1/problems", problemRouter)     

app.use("/api/v1/submissions", submissionRouter)

app.use("/api/v1/users", userRouter) 

app.use((req: Request, res: Response) => {
  res.status(404).json({ success: false, message: "Route not found" })
})

export default app