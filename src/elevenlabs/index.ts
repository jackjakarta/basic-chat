import { env } from '@/env';
import { ElevenLabsClient } from 'elevenlabs';

export const elevenlabs = new ElevenLabsClient({ apiKey: env.elevenlabsApiKey });
