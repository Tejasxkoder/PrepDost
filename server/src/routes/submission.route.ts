import { Router } from "express"
import { submit, mySubmissions, getOne } from "../controllers/submission.controller.js"
import { protect } from "../middlewares/auth.middleware.js"

const submissionRouter = Router()

submissionRouter.use(protect)
submissionRouter.post("/", submit)
submissionRouter.get("/", mySubmissions)
submissionRouter.get("/:id", getOne)

export default submissionRouter