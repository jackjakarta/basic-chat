import { eq, sql } from 'drizzle-orm';
import { z } from 'zod';

import { db } from '..';
import { conversationUsageTrackingTable, type InsertConversationUsageTrackingRow } from '../schema';

export async function dbInsertConversationUsage(value: InsertConversationUsageTrackingRow) {
  const [insertedUsage] = await db.insert(conversationUsageTrackingTable).values(value).returning();

  return insertedUsage;
}

export async function dbGetAmountOfTokensUsedByUserId({ userId }: { userId: string }) {
  const [amount] = await db
    .select({
      totalTokens: sql`SUM(${conversationUsageTrackingTable.promptTokens} + ${conversationUsageTrackingTable.completionTokens})`,
    })
    .from(conversationUsageTrackingTable)
    .where(eq(conversationUsageTrackingTable.userId, userId));

  const parsedNumber = z.number().safeParse(Number(amount?.totalTokens));

  if (!parsedNumber.success) {
    return 0;
  }

  return parsedNumber.data;
}
