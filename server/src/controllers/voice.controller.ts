import type { Request, Response, NextFunction } from "express";
import * as voiceService from "../services/voice.service.js";

export async function healthCheckController(
  _req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const result = await voiceService.checkVoiceProviderHealth();
    res.status(result.success ? 200 : 503).json(result);
  } catch (error) {
    next(error);
  }
}

export function listSttModelsController(_req: Request, res: Response): void {
  res.status(200).json({ success: true, data: voiceService.getAvailableSttModels() });
}

export function listVoicesController(_req: Request, res: Response): void {
  res.status(200).json({ success: true, data: voiceService.getAvailableVoices() });
}

export async function transcribeController(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    if (!req.file) {
      res.status(400).json({ success: false, message: "Audio file is required (field: audio)" });
      return;
    }

    // multer puts non-file text fields on req.body for multipart/form-data requests
    const { model } = req.body as { model?: string };

    const result = await voiceService.transcribeInterviewAnswer(
      {
        buffer: req.file.buffer,
        mimetype: req.file.mimetype,
        size: req.file.size,
        originalname: req.file.originalname,
      },
      model
    );

    res.status(200).json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
}

export async function textToSpeechController(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const { text, voice } = req.body as { text?: string; voice?: string };

    if (!text) {
      res.status(400).json({ success: false, message: "text is required" });
      return;
    }

    const audioBuffer = await voiceService.generateInterviewSpeech(text, voice);

    res.set({
      "Content-Type": "audio/wav",
      "Content-Length": audioBuffer.length.toString(),
    });
    res.status(200).send(audioBuffer);
  } catch (error) {
    next(error);
  }
}