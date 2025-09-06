import { and, desc, eq } from 'drizzle-orm';

import { db } from '..';
import {
  chatProjectTable,
  conversationTable,
  fileTable,
  type ChatProjectRow,
  type ConversationRow,
  type InsertChatProjectRow,
  type UpdateChatProjectRow,
} from '../schema';
import { type WithConversations } from '../types';

export type ChatProjectWithConversations = WithConversations<ChatProjectRow>;

export async function dbGetChatProjectsByUserId({ userId }: { userId: string }) {
  const rows = await db
    .select()
    .from(chatProjectTable)
    .leftJoin(conversationTable, eq(conversationTable.chatProjectId, chatProjectTable.id))
    .where(and(eq(chatProjectTable.userId, userId)))
    .orderBy(desc(conversationTable.updatedAt));

  const chatProjectsMap = new Map<string, ChatProjectRow & { conversations: ConversationRow[] }>();

  for (const row of rows) {
    const chatProject = row.chat_project;
    const conversation = row.conversation;

    if (!chatProjectsMap.has(chatProject.id)) {
      chatProjectsMap.set(chatProject.id, {
        ...chatProject,
        conversations: [],
      });
    }

    if (conversation !== null) {
      chatProjectsMap.get(chatProject.id)?.conversations.push(conversation);
    }
  }

  return Array.from(chatProjectsMap.values());
}

export async function dbUpdateChatProject({
  chatProjectId,
  userId,
  data,
}: {
  chatProjectId: string;
  userId: string;
  data: UpdateChatProjectRow;
}) {
  const [chatProject] = await db
    .update(chatProjectTable)
    .set(data)
    .where(and(eq(chatProjectTable.id, chatProjectId), eq(chatProjectTable.userId, userId)))
    .returning();

  return chatProject;
}

export async function dbGetChatProjectAndConversations({
  userId,
  chatProjectId,
}: {
  userId: string;
  chatProjectId: string;
}) {
  const rows = await db
    .select()
    .from(chatProjectTable)
    .leftJoin(conversationTable, eq(conversationTable.chatProjectId, chatProjectTable.id))
    .where(and(eq(chatProjectTable.id, chatProjectId), eq(chatProjectTable.userId, userId)))
    .orderBy(desc(conversationTable.updatedAt));

  if (rows.length === 0) {
    return undefined;
  }

  const chatProject = rows[0]!.chat_project;
  const conversations: ConversationRow[] = [];

  for (const row of rows) {
    const conversation = row.conversation;
    if (conversation) {
      conversations.push(conversation);
    }
  }

  const chatProjectAndConversations = { ...chatProject, conversations };

  return chatProjectAndConversations;
}

export async function dbGetChatProjectById({
  userId,
  chatProjectId,
}: {
  userId: string;
  chatProjectId: string;
}) {
  const [chatProject] = await db
    .select()
    .from(chatProjectTable)
    .where(and(eq(chatProjectTable.id, chatProjectId), eq(chatProjectTable.userId, userId)));

  return chatProject;
}

export async function dbDeleteChatProject({
  chatProjectId,
  userId,
}: {
  chatProjectId: string;
  userId: string;
}) {
  const deleted = await db.transaction(async (tx) => {
    await tx
      .delete(conversationTable)
      .where(
        and(
          eq(conversationTable.chatProjectId, chatProjectId),
          eq(conversationTable.userId, userId),
        ),
      );

    await tx
      .delete(fileTable)
      .where(and(eq(fileTable.chatProjectId, chatProjectId), eq(fileTable.userId, userId)));

    const [chatProject] = await tx
      .delete(chatProjectTable)
      .where(eq(chatProjectTable.id, chatProjectId))
      .returning();

    return chatProject;
  });

  return deleted;
}

export async function dbCreateChatProject(data: InsertChatProjectRow) {
  const [chatProject] = await db.insert(chatProjectTable).values(data).returning();

  return chatProject;
}
