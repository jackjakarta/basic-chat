import { type UserRow } from '@/db/schema';

export function constructSystemPrompt({ firstName, lastName }: Partial<UserRow>) {
  if (firstName && lastName) {
    return `You are chatting with ${firstName} ${lastName}. Please note that this is a personal conversation. Please address ${firstName} by name.`;
  }

  return 'You are chatting with an AI assistant.';
}
