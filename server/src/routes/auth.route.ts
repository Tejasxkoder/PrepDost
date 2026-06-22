import { Router } from "express"
import {
  register,
  login,
  getMe,
  logout,
} from "../controllers/auth.controller.js"
import { protect } from "../middlewares/auth.middleware.js"

const authRouter = Router()

authRouter.post("/register", register)
authRouter.post("/login", login)
authRouter.get("/me", protect, getMe)
authRouter.post("/logout", protect, logout)

export default authRouter