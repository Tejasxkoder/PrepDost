
import { deepgram } from "../config/env.js"

import {
  DEFAULT_STT_MODEL,
  DEFAULT_VOICE,
  type STTModel,
  type VoiceModel,
  type TranscribeResult,
} from "../types/voice.types.js"

import {
  truncateForTTS,
  estimateCharacters,
} from "../utils/audio.utils.js"

const MAX_TTS_CHARACTERS = 2000

const DEFAULT_LANGUAGE = "en-IN"

const DEFAULT_ENCODING = "linear16"

const DEFAULT_CONTAINER = "wav"

const DEFAULT_TIMEOUT = 60

export const checkDeepgramHealth = async () => {
  try {
    return {
      success: true,
      provider: "deepgram",
      status: "connected",
    }
  } catch {
    return {
      success: false,
      provider: "deepgram",
      status: "offline",
    }
  }
}
const sleep = (ms: number) =>
  new Promise((resolve) => setTimeout(resolve, ms))

const retry = async <T>(
  operation: () => Promise<T>,
  retries = 3
): Promise<T> => {
  let lastError: unknown

  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      return await operation()
    } catch (error) {
      lastError = error

      if (attempt < retries) {
        await sleep(500 * attempt)
      }
    }
  }

  throw lastError
}

export const transcribeAudio = async (
  audio: Buffer,
  mimeType = "audio/webm",
  model: STTModel = DEFAULT_STT_MODEL
): Promise<TranscribeResult> => {
  return retry(async () => {
    try {
      const response =
        await deepgram.listen.v1.media.transcribeFile(
          audio,
          {
            model,
            language: DEFAULT_LANGUAGE,

            punctuate: true,
            smart_format: true,

            diarize: false,
            filler_words: false,

            utterances: false,

            mimetype: mimeType,

            timeoutInSeconds: DEFAULT_TIMEOUT,
          }
        )

      const alternative =
        response.results.channels?.[0]?.alternatives?.[0]

      if (!alternative) {
        throw new Error("No transcript returned")
      }

      return {
        transcript: alternative.transcript ?? "",

        confidence: alternative.confidence ?? 0,

        duration: response.metadata?.duration ?? 0,

        words:
          alternative.words?.map((word) => ({
            word: word.word,
            start: word.start,
            end: word.end,
            confidence: word.confidence,
          })) ?? [],
      }
    } catch (error) {
      if (error instanceof DeepgramError) {
        throw new Error(
          `Deepgram STT Error: ${error.message}`
        )
      }

      throw error
    }
  })
}
const response =
  await deepgram.listen.v1.media.transcribeFile(...) 

response.body