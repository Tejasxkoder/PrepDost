import type {
  AudioValidationResult,
  UploadedAudioFile,
} from "../types/voice.types.js"

export const MAX_AUDIO_SIZE_MB = 10

export const MAX_AUDIO_SIZE_BYTES =
  MAX_AUDIO_SIZE_MB * 1024 * 1024

export const SUPPORTED_AUDIO_TYPES = [
  "audio/webm",
  "audio/webm;codecs=opus",
  "audio/wav",
  "audio/wave",
  "audio/x-wav",
  "audio/mp3",
  "audio/mpeg",
  "audio/mp4",
  "audio/ogg",
] as const

export const SUPPORTED_EXTENSIONS = [
  ".webm",
  ".wav",
  ".mp3",
  ".mp4",
  ".ogg",
] as const

export const validateAudio = (
  file: UploadedAudioFile
): AudioValidationResult => {
  if (!file) {
    return {
      valid: false,
      error: "Audio file is required",
    }
  }

  if (file.size === 0) {
    return {
      valid: false,
      error: "Audio file is empty",
    }
  }

  if (
    file.size >
    MAX_AUDIO_SIZE_BYTES
  ) {
    return {
      valid: false,
      error: `Maximum audio size is ${MAX_AUDIO_SIZE_MB} MB`,
    }
  }

  const validMime =
    SUPPORTED_AUDIO_TYPES.includes(
      file.mimetype as any
    )

  const validExtension =
    SUPPORTED_EXTENSIONS.some((ext) =>
      file.originalname
        .toLowerCase()
        .endsWith(ext)
    )

  if (!validMime && !validExtension) {
    return {
      valid: false,
      error: "Unsupported audio format",
    }
  }

  return {
    valid: true,
  }
}

export const truncateForTTS = (
  text: string,
  limit = 2000
) => {
  if (text.length <= limit) {
    return text
  }

  return text.slice(0, limit)
}

export const estimateCharacters = (
  text: string
) => text.trim().length