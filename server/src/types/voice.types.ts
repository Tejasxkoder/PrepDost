// ── Speech-to-Text models ────────────────────────────────────────────────

export const STT_MODELS = [
  "nova-3",
  "nova-2",
  "nova-2-conversationalai",
  "nova-2-meeting",
  "base",
] as const;

export type SttModelId = (typeof STT_MODELS)[number];

export interface SttModelOption {
  id: SttModelId;
  label: string;
  description: string;
}

export const STT_MODEL_OPTIONS: readonly SttModelOption[] = [
  {
    id: "nova-3",
    label: "Nova 3",
    description: "Highest accuracy, general purpose. Best default for interview answers.",
  },
  {
    id: "nova-2",
    label: "Nova 2",
    description: "Previous-gen general purpose model.",
  },
  {
    id: "nova-2-conversationalai",
    label: "Nova 2 · Conversational AI",
    description: "Tuned for back-and-forth spoken conversation, good for Q&A style interviews.",
  },
  {
    id: "nova-2-meeting",
    label: "Nova 2 · Meeting",
    description: "Tuned for multi-speaker audio, useful for panel-style mock interviews.",
  },
  {
    id: "base",
    label: "Base",
    description: "Lightweight fallback model.",
  },
];

export const DEFAULT_STT_MODEL: SttModelId = "nova-3";

// ── Text-to-Speech voices (Deepgram Aura-2, English) ────────────────────
// Metadata sourced from https://developers.deepgram.com/docs/tts-models

export const VOICE_MODELS = [
  "aura-2-thalia-en",
  "aura-2-arcas-en",
  "aura-2-orion-en",
  "aura-2-athena-en",
  "aura-2-draco-en",
  "aura-2-aurora-en",
  "aura-2-delia-en",
  "aura-2-hyperion-en",
  "aura-2-juno-en",
  "aura-2-ophelia-en",
  "aura-2-pluto-en",
  "aura-2-vesta-en",
] as const;

export type VoiceId = (typeof VOICE_MODELS)[number];

export interface VoiceOption {
  id: VoiceId;
  name: string;
  gender: "masculine" | "feminine";
  accent: string;
  characteristics: string[];
  useCases: string[];
}

export const VOICE_OPTIONS: readonly VoiceOption[] = [
  {
    id: "aura-2-thalia-en",
    name: "Thalia",
    gender: "feminine",
    accent: "American",
    characteristics: ["Clear", "Confident", "Energetic", "Enthusiastic"],
    useCases: ["Casual chat", "Customer service", "IVR"],
  },
  {
    id: "aura-2-arcas-en",
    name: "Arcas",
    gender: "masculine",
    accent: "American",
    characteristics: ["Natural", "Smooth", "Clear", "Comfortable"],
    useCases: ["Customer service", "Casual chat"],
  },
  {
    id: "aura-2-orion-en",
    name: "Orion",
    gender: "masculine",
    accent: "American",
    characteristics: ["Approachable", "Comfortable", "Calm", "Polite"],
    useCases: ["Informative"],
  },
  {
    id: "aura-2-athena-en",
    name: "Athena",
    gender: "feminine",
    accent: "American",
    characteristics: ["Calm", "Smooth", "Professional"],
    useCases: ["Storytelling"],
  },
  {
    id: "aura-2-draco-en",
    name: "Draco",
    gender: "masculine",
    accent: "British",
    characteristics: ["Warm", "Approachable", "Trustworthy", "Baritone"],
    useCases: ["Storytelling"],
  },
  {
    id: "aura-2-aurora-en",
    name: "Aurora",
    gender: "feminine",
    accent: "American",
    characteristics: ["Cheerful", "Expressive", "Energetic"],
    useCases: ["Interview"],
  },
  {
    id: "aura-2-delia-en",
    name: "Delia",
    gender: "feminine",
    accent: "American",
    characteristics: ["Casual", "Friendly", "Cheerful", "Breathy"],
    useCases: ["Interview"],
  },
  {
    id: "aura-2-hyperion-en",
    name: "Hyperion",
    gender: "masculine",
    accent: "Australian",
    characteristics: ["Caring", "Warm", "Empathetic"],
    useCases: ["Interview"],
  },
  {
    id: "aura-2-juno-en",
    name: "Juno",
    gender: "feminine",
    accent: "American",
    characteristics: ["Natural", "Engaging", "Melodic", "Breathy"],
    useCases: ["Interview"],
  },
  {
    id: "aura-2-ophelia-en",
    name: "Ophelia",
    gender: "feminine",
    accent: "American",
    characteristics: ["Expressive", "Enthusiastic", "Cheerful"],
    useCases: ["Interview"],
  },
  {
    id: "aura-2-pluto-en",
    name: "Pluto",
    gender: "masculine",
    accent: "American",
    characteristics: ["Smooth", "Calm", "Empathetic", "Baritone"],
    useCases: ["Interview", "Storytelling"],
  },
  {
    id: "aura-2-vesta-en",
    name: "Vesta",
    gender: "feminine",
    accent: "American",
    characteristics: ["Natural", "Expressive", "Patient", "Empathetic"],
    useCases: ["Customer service", "Interview", "Storytelling"],
  },
];

export const DEFAULT_VOICE: VoiceId = "aura-2-thalia-en";

// ── Shared voice-module types ────────────────────────────────────────────

export interface TranscriptWord {
  word: string;
  start: number;
  end: number;
  confidence: number;
}

export interface TranscribeResult {
  transcript: string;
  confidence: number;
  duration: number;
  words: TranscriptWord[];
}

export interface UploadedAudioFile {
  buffer: Buffer;
  mimetype: string;
  size: number;
  originalname: string;
}

export interface AudioValidationResult {
  valid: boolean;
  reason?: string;
}