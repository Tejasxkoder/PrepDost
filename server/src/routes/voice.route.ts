import { Router } from "express";
import { uploadAudio } from "../middlewares/upload.middleware.js";
import {
  healthCheckController,
  transcribeController,
  textToSpeechController,
} from "../controllers/voice.controller.js";


const router = Router();

router.get("/health", healthCheckController);
router.post("/transcribe", /* authenticate, */ uploadAudio, transcribeController);
router.post("/speak", /* authenticate, */ textToSpeechController);

export default router;