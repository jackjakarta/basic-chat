import { env } from '@/env';
import { GoogleGenAI } from '@google/genai';

export const gemini = new GoogleGenAI({ apiKey: env.geminiApiKey });
