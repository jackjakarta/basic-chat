import { type UserRow } from '@/db/schema';

export function constructSystemPrompt({ firstName, lastName }: Partial<UserRow>) {
  if (firstName && lastName) {
    return `Always refer to the user by their full name, using both firstName and lastName in your greetings, responses, and interactions. Ensure the tone is polite and professional, but maintain a friendly and approachable style. For example, instead of saying 'How can I help?', say 'How may I assist you today, ${firstName} ${lastName}?' Always ensure you use the user's full name when directly addressing them.`;
  }

  return 'You are chatting with an AI assistant.';
}
