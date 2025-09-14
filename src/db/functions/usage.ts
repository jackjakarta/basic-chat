import { and, eq, sql } from 'drizzle-orm';
import { z } from 'zod';

import { db } from '..';
import { conversationUsageTrackingTable, type InsertConversationUsageTrackingRow } from '../schema';

export const tokenUsageSchema = z.object({
  promptTokens: z.number().min(0),
  completionTokens: z.number().min(0),
  totalTokens: z.number().min(0),
});

export type AmountOfTokensUsed = z.infer<typeof tokenUsageSchema>;

export async function dbInsertConversationUsage(value: InsertConversationUsageTrackingRow) {
  const [insertedUsage] = await db.insert(conversationUsageTrackingTable).values(value).returning();

  return insertedUsage;
}

export async function dbGetAmountOfTokensUsedByUserId({ userId }: { userId: string }) {
  const [amount] = await db
    .select({
      promptTokens: sql`SUM(${conversationUsageTrackingTable.promptTokens})`,
      completionTokens: sql`SUM(${conversationUsageTrackingTable.completionTokens})`,
      totalTokens: sql`SUM(${conversationUsageTrackingTable.promptTokens} + ${conversationUsageTrackingTable.completionTokens})`,
    })
    .from(conversationUsageTrackingTable)
    .where(
      and(
        eq(conversationUsageTrackingTable.userId, userId),
        sql`EXTRACT(MONTH FROM ${conversationUsageTrackingTable.createdAt}) = EXTRACT(MONTH FROM CURRENT_DATE)`,
        sql`EXTRACT(YEAR FROM ${conversationUsageTrackingTable.createdAt}) = EXTRACT(YEAR FROM CURRENT_DATE)`,
      ),
    );

  const parsedNumber = tokenUsageSchema.safeParse({
    promptTokens: Number(amount?.promptTokens),
    completionTokens: Number(amount?.completionTokens),
    totalTokens: Number(amount?.totalTokens),
  });

  if (!parsedNumber.success) {
    console.error('Failed to parse amount of tokens used:', parsedNumber.error);
    return {
      promptTokens: 0,
      completionTokens: 0,
      totalTokens: 0,
    };
  }

  return parsedNumber.data;
}
