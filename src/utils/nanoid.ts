import { customAlphabet } from 'nanoid';

export function generateCode({ length }: { length?: number }): string {
  const nanoid = customAlphabet('ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789', length ?? 8);

  const generatedId = nanoid();

  return generatedId;
}
