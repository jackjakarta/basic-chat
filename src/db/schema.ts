import {
  boolean,
  integer,
  pgEnum,
  pgTable,
  text,
  timestamp,
  unique,
  uuid,
} from 'drizzle-orm/pg-core';
import { z } from 'zod';

export const userTable = pgTable('user', {
  id: uuid('id').defaultRandom().primaryKey(),
  email: text('email').notNull().unique(),
  firstName: text('first_name').notNull(),
  lastName: text('last_name').notNull(),
  passwordHash: text('password_hash').notNull(),
  emailVerified: boolean('email_verified').notNull().default(false),
  createdAt: timestamp('created_at', { mode: 'date', withTimezone: true }).defaultNow().notNull(),
});

export type UserRow = typeof userTable.$inferSelect;
export type InsertUserRow = typeof userTable.$inferInsert;

export const tokenActionSchema = z.enum(['verify-email', 'reset-password']);
export const tokenActionPgEnum = pgEnum('token_action', tokenActionSchema.options);
export type TokenAction = z.infer<typeof tokenActionSchema>;

export const tokenTable = pgTable(
  'action_token',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    action: tokenActionPgEnum('action').notNull(),
    token: text('token').notNull(),
    email: text('email'),
    createdAt: timestamp('created_at', { mode: 'date', withTimezone: true }).defaultNow().notNull(),
  },
  (table) => {
    return {
      uniqueEmailAction: unique().on(table.email, table.action),
    };
  },
);

export type TokenRow = typeof tokenTable.$inferSelect;
export type InsertTokenRow = typeof tokenTable.$inferInsert;

export const conversationTable = pgTable('conversation', {
  id: uuid('id').defaultRandom().primaryKey(),
  name: text('name'),
  userId: uuid('user_id')
    .references(() => userTable.id)
    .notNull(),
  createdAt: timestamp('created_at', { mode: 'date', withTimezone: true }).defaultNow().notNull(),
});

export type ConversationRow = typeof conversationTable.$inferSelect;
export type InsertConversationRow = typeof conversationTable.$inferInsert;

export const conversationRoleSchema = z.enum(['user', 'assistant', 'system']);
export const conversationRolePgEnum = pgEnum('conversation_role', conversationRoleSchema.options);
export type ConversationRole = z.infer<typeof conversationRoleSchema>;

export const conversationMessageTable = pgTable('conversation_message', {
  id: uuid('id').defaultRandom().primaryKey(),
  content: text('content').notNull(),
  conversationId: uuid('conversation_id')
    .references(() => conversationTable.id)
    .notNull(),
  userId: uuid('user_id').references(() => userTable.id),
  role: conversationRolePgEnum('role').notNull(),
  orderNumber: integer('order_number').notNull(),
  createdAt: timestamp('created_at', { mode: 'date', withTimezone: true }).defaultNow().notNull(),
});

export type ConversationMessageRow = typeof conversationMessageTable.$inferSelect;
export type InsertConversationMessageRow = typeof conversationMessageTable.$inferInsert;
