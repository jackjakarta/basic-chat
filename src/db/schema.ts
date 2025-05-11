import {
  dataSourceIntegrationStateSchema,
  dataSourceIntegrationTypeSchema,
  OAuthTokenMetadata,
} from '@/app/api/auth/notion/types';
import {
  boolean,
  integer,
  json,
  jsonb,
  pgSchema,
  text,
  timestamp,
  unique,
  uuid,
} from 'drizzle-orm/pg-core';
import { z } from 'zod';

export const appSchema = pgSchema('app');

export const authProviderSchema = z.enum(['credentials', 'github', 'google']);
export const authProviderPgEnum = appSchema.enum('auth_provider', authProviderSchema.options);
export type AuthProvider = z.infer<typeof authProviderSchema>;

export const userSettingsSchema = z.object({
  customInstructions: z.string().optional(),
});

export type UserSettings = z.infer<typeof userSettingsSchema>;

export const userTable = appSchema.table('user_entity', {
  id: uuid('id').defaultRandom().primaryKey(),
  email: text('email').notNull().unique(),
  firstName: text('first_name').notNull(),
  lastName: text('last_name').notNull(),
  passwordHash: text('password_hash').notNull(),
  authProvider: authProviderPgEnum('auth_provider').notNull(),
  emailVerified: boolean('email_verified').notNull().default(false),
  settings: json('settings').$type<UserSettings>(),
  createdAt: timestamp('created_at', { mode: 'date', withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { mode: 'date', withTimezone: true })
    .defaultNow()
    .notNull()
    .$onUpdate(() => new Date()),
});

export type UserRow = typeof userTable.$inferSelect;
export type InsertUserRow = typeof userTable.$inferInsert;

export const tokenActionSchema = z.enum(['verify-email', 'reset-password']);
export const tokenActionPgEnum = appSchema.enum('token_action', tokenActionSchema.options);
export type TokenAction = z.infer<typeof tokenActionSchema>;

export const tokenTable = appSchema.table(
  'action_token',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    action: tokenActionPgEnum('action').notNull(),
    token: text('token').unique().notNull(),
    email: text('email'),
    createdAt: timestamp('created_at', { mode: 'date', withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp('updated_at', { mode: 'date', withTimezone: true })
      .defaultNow()
      .notNull()
      .$onUpdate(() => new Date()),
    expiresAt: timestamp('expires_at', { mode: 'date', withTimezone: true }),
  },
  (table) => {
    return {
      uniqueEmailAction: unique().on(table.email, table.action),
    };
  },
);

export type TokenRow = typeof tokenTable.$inferSelect;
export type InsertTokenRow = typeof tokenTable.$inferInsert;

export const conversationTable = appSchema.table('conversation', {
  id: uuid('id').defaultRandom().primaryKey(),
  name: text('name'),
  userId: uuid('user_id')
    .references(() => userTable.id)
    .notNull(),
  agentId: uuid('agent_id').references(() => agentTable.id),
  createdAt: timestamp('created_at', { mode: 'date', withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { mode: 'date', withTimezone: true })
    .defaultNow()
    .notNull()
    .$onUpdate(() => new Date()),
});

export type ConversationRow = typeof conversationTable.$inferSelect;
export type InsertConversationRow = typeof conversationTable.$inferInsert;

export const conversationRoleSchema = z.enum(['user', 'assistant', 'system']);
export const conversationRolePgEnum = appSchema.enum(
  'conversation_role',
  conversationRoleSchema.options,
);
export type ConversationRole = z.infer<typeof conversationRoleSchema>;
export type ConversationMessageMetadata = {
  modelId?: string;
};

export const conversationMessageTable = appSchema.table('conversation_message', {
  id: uuid('id').defaultRandom().primaryKey(),
  content: text('content').notNull(),
  conversationId: uuid('conversation_id')
    .references(() => conversationTable.id)
    .notNull(),
  userId: uuid('user_id').references(() => userTable.id),
  role: conversationRolePgEnum('role').notNull(),
  orderNumber: integer('order_number').notNull(),
  metadata: json('metadata').$type<ConversationMessageMetadata>(),
  createdAt: timestamp('created_at', { mode: 'date', withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { mode: 'date', withTimezone: true })
    .defaultNow()
    .notNull()
    .$onUpdate(() => new Date()),
});

export type ConversationMessageRow = typeof conversationMessageTable.$inferSelect;
export type InsertConversationMessageRow = typeof conversationMessageTable.$inferInsert;

export const agentTable = appSchema.table('agent', {
  id: uuid('id').defaultRandom().primaryKey(),
  name: text('name').notNull(),
  instructions: text('instructions'),
  pictureUrl: text('picture_url'),
  userId: uuid('user_id')
    .references(() => userTable.id)
    .notNull(),
  vectorStoreId: text('vector_store_id').references(() => vectorStoreTable.id),
  createdAt: timestamp('created_at', { mode: 'date', withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { mode: 'date', withTimezone: true })
    .defaultNow()
    .notNull()
    .$onUpdate(() => new Date()),
});

export type AgentRow = typeof agentTable.$inferSelect;
export type InsertAgentRow = typeof agentTable.$inferInsert;

export const vectorFileSchema = z.object({
  fileId: z.string(),
  fileName: z.string(),
});

export type VectorFile = z.infer<typeof vectorFileSchema>;

export const vectorStoreTable = appSchema.table('vector_store', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  files: jsonb('files').$type<VectorFile[]>(),
  userId: uuid('user_id')
    .references(() => userTable.id)
    .notNull(),
  createdAt: timestamp('created_at', { mode: 'date', withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { mode: 'date', withTimezone: true })
    .defaultNow()
    .notNull()
    .$onUpdate(() => new Date()),
});

export type VectorStoreRow = typeof vectorStoreTable.$inferSelect;
export type InsertVectorStoreRow = typeof vectorStoreTable.$inferInsert;

export const dataSourceIntegrationStateEnum = appSchema.enum(
  'data_source_integration_state',
  dataSourceIntegrationStateSchema.options,
);
export const dataSourceIntegrationTypeEnum = appSchema.enum(
  'data_source_integration_type',
  dataSourceIntegrationTypeSchema.options,
);

export const dataSourceIntegrationTable = appSchema.table('data_source_integration', {
  id: uuid('id').defaultRandom().primaryKey(),
  name: text('name').notNull(),
  description: text('description').notNull(),
  type: dataSourceIntegrationTypeEnum('type').notNull(),
  state: dataSourceIntegrationStateEnum('state').notNull(),
  createdAt: timestamp('created_at', { mode: 'date', withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { mode: 'date', withTimezone: true })
    .defaultNow()
    .notNull()
    .$onUpdate(() => new Date()),
});

export type DataSourceIntegrationInsertModel = typeof dataSourceIntegrationTable.$inferInsert;
export type DataSourceIntegrationModel = typeof dataSourceIntegrationTable.$inferSelect;

export const dataSourceIntegrationUserMappingTable = appSchema.table(
  'data_source_integration_user_mapping',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    userId: uuid('user_id')
      .references(() => userTable.id)
      .notNull(),
    dataSourceIntegrationId: uuid('data_source_integration_id')
      .references(() => dataSourceIntegrationTable.id)
      .notNull(),
    enabled: boolean('enabled').default(false).notNull(),
    oauthMetadata: json('oauth_metadata').$type<OAuthTokenMetadata>().notNull(),
    createdAt: timestamp('created_at', { mode: 'date', withTimezone: true }).defaultNow().notNull(),
  },
  (table) => {
    return {
      uniqueIntegrationByUser: unique().on(table.userId, table.dataSourceIntegrationId),
    };
  },
);
export type DataSourceIntegrationUserMappingInsertModel =
  typeof dataSourceIntegrationUserMappingTable.$inferInsert;
export type DataSourceIntegrationUserMappingModel =
  typeof dataSourceIntegrationUserMappingTable.$inferSelect;
