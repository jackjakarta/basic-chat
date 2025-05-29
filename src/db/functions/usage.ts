import { db } from '..';
import { conversationUsageTrackingTable, type InsertConversationUsageTrackingRow } from '../schema';

export async function dbInsertConversationUsage(value: InsertConversationUsageTrackingRow) {
  const [insertedUsage] = await db.insert(conversationUsageTrackingTable).values(value).returning();

  return insertedUsage;
}
