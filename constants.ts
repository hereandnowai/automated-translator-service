
import { Language } from './types';

export const COMPANY_NAME: string = "HEREANDNOW AI RESEARCH INSTITUTE";
export const COMPANY_LOGO_URL: string = "https://raw.githubusercontent.com/hereandnowai/images/refs/heads/main/logos/HNAI%20Fevicon%20-Teal%20%26%20Golden%20Logo%20-%20DESIGN%203%20-%20Raj-03.png";
export const COMPANY_TITLE_IMAGE_URL: string = "https://raw.githubusercontent.com/hereandnowai/images/refs/heads/main/logos/HNAI%20Title%20-Teal%20%26%20Golden%20Logo%20-%20DESIGN%203%20-%20Raj-07.png";

export const SUPPORTED_LANGUAGES: Language[] = [
  { code: 'es', name: 'Spanish' },
  { code: 'fr', name: 'French' },
  { code: 'de', name: 'German' },
  { code: 'ja', name: 'Japanese' },
  { code: 'ko', name: 'Korean' },
  { code: 'zh', name: 'Chinese (Simplified)' },
  { code: 'pt', name: 'Portuguese' },
  { code: 'it', name: 'Italian' },
  { code: 'ru', name: 'Russian' },
  { code: 'ar', name: 'Arabic' },
  { code: 'hi', name: 'Hindi' },
  { code: 'ta', name: 'Tamil' }, // Added Tamil
  { code: 'en', name: 'English' }, // Good to have English as a target too
];

export const GEMINI_MODEL_NAME = 'gemini-2.5-flash-preview-04-17';
export const THEME_STORAGE_KEY = 'appTheme';
export const APP_VERSION = "1.2.0";
export const FEEDBACK_EMAIL = "feedback@hereandnow.ai"; // Example email