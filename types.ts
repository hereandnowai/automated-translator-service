export interface Language {
  code: string;
  name: string;
}

export interface TranslationResponse {
  sourceLanguage: string;
  targetLanguage: string;
  translation: string;
  alternativeOptions: string[];
  contextNotes: string;
  confidenceLevel: 'High' | 'Medium' | 'Low' | string;
  detectedSourceLanguageCode: string;
}

// This type is for the structure Gemini API is expected to return *within* its response.text for translations
export interface GeminiTranslationOutput {
  sourceLanguage: string; // Detected full name of the source language (e.g., "English", "Spanish").
  targetLanguage: string; // Full name of the target language provided (e.g., "French", "German").
  translation: string; // The primary translated text.
  alternativeOptions: string[]; // Array of alternative translations, if appropriate. Keep concise (0-2 options).
  contextNotes: string; // Brief cultural or linguistic explanations if needed.
  confidenceLevel: 'High' | 'Medium' | 'Low'; // Your confidence in the translation quality.
  detectedSourceLanguageCode: string; // Detected IETF BCP 47 language code for the source text (e.g., "en", "es").
}

export type AppMode = 'translator' | 'assistant' | 'settings';

export type RecordingFor = 'translator' | 'assistant' | null; // Keep this specific to features that use mic directly

export type AppTheme = 'default' | 'light' | 'dark';