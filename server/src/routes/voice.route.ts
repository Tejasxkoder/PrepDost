import { Router } from "express";
import { uploadAudio } from "../middlewares/upload.middleware.js";
import {
  healthCheckController,
  listSttModelsController,
  listVoicesController,
  transcribeController,
  textToSpeechController,
} from "../controllers/voice.controller.js";
// import { authenticate } from "../middlewares/auth.middleware.js"; // your existing JWT middleware

const router = Router();

router.get("/health", healthCheckController);
router.get("/models", listSttModelsController);
router.get("/voices", listVoicesController);
router.post("/transcribe", /* authenticate, */ uploadAudio, transcribeController);
router.post("/speak", /* authenticate, */ textToSpeechController);

export default router;