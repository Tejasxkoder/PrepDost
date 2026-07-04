import { Router } from "express"
import { list, getBySlug, create, stats } from "../controllers/problem.controller.js"
import { protect, restrictTo } from "../middlewares/auth.middleware.js"

const problemRouter = Router()

problemRouter.get("/", list)
problemRouter.get("/stats", stats)
problemRouter.get("/:slug", getBySlug)
problemRouter.post("/", protect, restrictTo("admin"), create)

export default problemRouter