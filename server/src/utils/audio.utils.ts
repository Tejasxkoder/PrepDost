import type { AudioValidationResult, UploadedAudioFile } from "../types/voice.types.js";

/**
 * Audio mimetypes accepted for interview-answer uploads.
 * Covers common browser MediaRecorder output (webm/ogg) as well as
 * standard file uploads (wav/mp3/m4a).
 */
export const SUPPORTED_AUDIO_TYPES: readonly string[] = [
  "audio/wav",
  "audio/wave",
  "audio/x-wav",
  "audio/mpeg",
  "audio/mp3",
  "audio/webm",
  "audio/ogg",
  "audio/mp4",
  "audio/x-m4a",
];

/** 25 MB — comfortably covers a multi-minute interview answer at typical bitrates. */
export const MAX_AUDIO_SIZE = 25 * 1024 * 1024;

/**
 * Deepgram's Aura TTS endpoint rejects requests over ~2000 characters
 * (413 "Input Text Exceeds Character Limits"). Kept as a named constant
 * so truncateForTTS and any future cost-estimation logic stay in sync.
 */
export const MAX_TTS_CHARACTERS = 2000;

/**
 * Validates an uploaded audio file against supported mimetypes and size limits
 * before it's sent to Deepgram. Runs before any external API call, so bad
 * uploads fail fast and cheap.
 */
export function validateAudio(file: UploadedAudioFile): AudioValidationResult {
  if (!file.buffer || file.size === 0) {
    return { valid: false, reason: "Audio file is empty" };
  }

  if (!SUPPORTED_AUDIO_TYPES.includes(file.mimetype)) {
    return {
      valid: false,
      reason: `Unsupported audio type: ${file.mimetype}. Supported types: ${SUPPORTED_AUDIO_TYPES.join(", ")}`,
    };
  }

  if (file.size > MAX_AUDIO_SIZE) {
    const maxMb = (MAX_AUDIO_SIZE / (1024 * 1024)).toFixed(0);
    return { valid: false, reason: `Audio file exceeds the ${maxMb}MB limit` };
  }

  return { valid: true };
}

/**
 * Truncates text to fit Deepgram's TTS character limit. Prefers cutting at the
 * last sentence boundary, falling back to the last word boundary, so playback
 * never ends mid-word.
 */
export function truncateForTTS(text: string, maxChars: number = MAX_TTS_CHARACTERS): string {
  const trimmed = text.trim();

  if (trimmed.length <= maxChars) {
    return trimmed;
  }

  const slice = trimmed.slice(0, maxChars);

  const lastSentenceEnd = Math.max(
    slice.lastIndexOf(". "),
    slice.lastIndexOf("! "),
    slice.lastIndexOf("? ")
  );

  if (lastSentenceEnd > maxChars * 0.5) {
    return slice.slice(0, lastSentenceEnd + 1).trim();
  }

  const lastSpace = slice.lastIndexOf(" ");
  return (lastSpace > 0 ? slice.slice(0, lastSpace) : slice).trim();
}

/**
 * Character count for a piece of text — used to check against MAX_TTS_CHARACTERS
 * before calling textToSpeech, or for rough cost estimation
 * (Deepgram Aura is billed per character).
 */
export function estimateCharacters(text: string): number {
  return text.trim().length;
}