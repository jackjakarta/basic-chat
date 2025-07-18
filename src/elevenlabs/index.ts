import { env } from '@/env';
import { ElevenLabsClient } from '@elevenlabs/elevenlabs-js';

const elevenlabsApiKey = env.elevenlabsApiKey;
export const elevenlabs = new ElevenLabsClient({ apiKey: elevenlabsApiKey });
