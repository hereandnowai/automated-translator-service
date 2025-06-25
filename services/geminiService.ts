
import { GoogleGenAI, GenerateContentResponse } from "@google/genai";
import { TranslationResponse, GeminiTranslationOutput } from '../types';
import { GEMINI_MODEL_NAME, SUPPORTED_LANGUAGES, COMPANY_NAME } from '../constants';

let aiInstance: GoogleGenAI | null = null;
let initializationError: Error | null = null;

const getApiKeySafely = (): string | undefined => {
  if (typeof process !== 'undefined' && process.env) {
    return process.env.API_KEY;
  }
  return undefined;
};

const getAiInstance = (): GoogleGenAI => {
  if (initializationError) {
    throw initializationError;
  }
  if (!aiInstance) {
    const apiKey = getApiKeySafely();
    if (!apiKey) {
      const errorMsg = "API_KEY environment variable not set or process.env is not available. Please ensure it is configured. AI functionalities are disabled.";
      console.error(`CRITICAL: ${errorMsg}`);
      initializationError = new Error(errorMsg);
      throw initializationError;
    }
    try {
      aiInstance = new GoogleGenAI({ apiKey });
    } catch (e) {
      const errorMsg = "Failed to initialize GoogleGenAI. This could be due to an invalid API_KEY or network issues.";
      console.error(`CRITICAL: ${errorMsg}`, e);
      initializationError = e instanceof Error ? e : new Error(String(e));
      if (initializationError.message === String(e) && !(e instanceof Error && e.message.includes("API_KEY"))) {
        initializationError.message = `${errorMsg} Details: ${initializationError.message}`;
      }
      throw initializationError;
    }
  }
  return aiInstance;
};

const parseJsonFromMarkdown = (jsonString: string): any => {
  const fenceRegex = /^```(\w*)?\s*\n?(.*?)\n?\s*```$/s;
  const match = jsonString.match(fenceRegex);
  if (match && match[2]) {
    jsonString = match[2].trim();
  }
  try {
    return JSON.parse(jsonString);
  } catch (e) {
    console.error("Failed to parse JSON response:", e, "Original string:", jsonString);
    throw new Error("The AI returned an invalid JSON format. The raw response was: " + jsonString);
  }
};

export const translateText = async (
  text: string,
  targetLanguageCode: string
): Promise<TranslationResponse> => {
  const localAi = getAiInstance(); // Get or initialize AI instance
  const targetLanguage = SUPPORTED_LANGUAGES.find(lang => lang.code === targetLanguageCode);
  if (!targetLanguage) {
    throw new Error(`Unsupported target language: ${targetLanguageCode}`);
  }

  const prompt = `
    You are an expert Automated Translation Services assistant from ${COMPANY_NAME}.
    Your primary function is to provide accurate, contextual, and professional translations.
    Maintain the original meaning, tone, and cultural nuances.
    The user wants to translate the following text to ${targetLanguage.name} (language code: ${targetLanguageCode}).
    Text to translate: "${text}"

    Your response MUST be a single, valid JSON object that strictly adheres to the following TypeScript interface:
    \`\`\`typescript
    interface GeminiTranslationOutput {
      sourceLanguage: string; // Detected full name of the source language (e.g., "English", "Spanish").
      targetLanguage: string; // Full name of the target language provided (e.g., "French", "German").
      translation: string; // The primary translated text.
      alternativeOptions: string[]; // Array of alternative translations, if appropriate. Keep concise (0-2 options).
      contextNotes: string; // Brief cultural or linguistic explanations if needed.
      confidenceLevel: 'High' | 'Medium' | 'Low'; // Your confidence in the translation quality.
      detectedSourceLanguageCode: string; // Detected IETF BCP 47 language code for the source text (e.g., "en", "es").
    }
    \`\`\`
    Analyze context, tone, and domain-specific terminology.
    If the source text is ambiguous, provide the most likely translation and note the ambiguity in contextNotes.
    Do NOT include any text outside of this JSON object.
    Ensure detectedSourceLanguageCode is the IETF BCP 47 code.
    Example for sourceLanguage: "English", detectedSourceLanguageCode: "en".
    Example for targetLanguage: "${targetLanguage.name}".
    `;

  try {
    const response: GenerateContentResponse = await localAi.models.generateContent({
      model: GEMINI_MODEL_NAME,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
      }
    });

    const jsonOutputString = response.text;
    const parsedResult: GeminiTranslationOutput = parseJsonFromMarkdown(jsonOutputString);
    
    return {
        sourceLanguage: parsedResult.sourceLanguage || "Unknown",
        targetLanguage: parsedResult.targetLanguage || targetLanguage.name,
        translation: parsedResult.translation || "",
        alternativeOptions: parsedResult.alternativeOptions || [],
        contextNotes: parsedResult.contextNotes || "",
        confidenceLevel: parsedResult.confidenceLevel || "Medium",
        detectedSourceLanguageCode: parsedResult.detectedSourceLanguageCode || "unknown"
    };

  } catch (error) {
    console.error('Error in translateText:', error);
    if (error instanceof Error) {
      throw error; 
    }
    throw new Error('An unexpected error occurred during translation with the AI service.');
  }
};

export const askAssistant = async (query: string): Promise<string> => {
  const localAi = getAiInstance(); // Get or initialize AI instance
  const appDescription = `
    You are an AI Assistant integrated within the "HEREANDNOW AI Services Suite" application, developed by ${COMPANY_NAME}.
    This application offers two main features:
    1.  Automated Translation Service:
        *   Core Capabilities: Translates text between many supported language pairs (including English, Spanish, French, German, Japanese, Korean, Chinese, Portuguese, Italian, Russian, Arabic, Hindi, Tamil), automatically detects source language, provides multiple translation options when appropriate, handles various content types (technical, business, creative), and aims to maintain formatting.
        *   Translation Workflow: Identifies source, confirms target, analyzes context, provides primary translation, offers alternatives, and explains cultural adaptations.
        *   Response Format (for translations): Includes Source Language, Target Language, Translation, Alternative Options, Context Notes, and Confidence Level.
        *   Special Features: Handles idioms/metaphors, maintains terminology consistency, adapts tone.
        *   Quality Assurance: Focuses on accuracy, cultural appropriateness, and preserving intent.
    2.  General AI Assistant (Your current role):
        *   You can answer user questions on a wide range of topics.
        *   You can help draft text, brainstorm ideas, summarize information, and more.
        *   You are aware of the translation capabilities of the application you are part of.
        *   Users can interact with you via text input or voice (microphone).

    When responding as the AI Assistant:
    - Be helpful, informative, and professional.
    - If a user's query seems related to translation, you can mention the app's translation feature or offer to help formulate a translation request.
    - If asked about the app itself, use the information above to answer.
    - If you are unsure about specialized terminology or if a query is too ambiguous, ask for clarification.
    - Prioritize accuracy and clarity in your responses.
    `;

  try {
    const response = await localAi.models.generateContent({
      model: GEMINI_MODEL_NAME,
      contents: query,
      config: {
        systemInstruction: appDescription,
      }
    });
    return response.text;
  } catch (error) {
    console.error('Error in askAssistant:', error);
    if (error instanceof Error) {
        throw error; 
    }
    throw new Error('An unexpected error occurred while communicating with the AI assistant.');
  }
};
