import {
  dataSourceIntegrationStateSchema,
  dataSourceIntegrationTypeSchema,
  type OAuthTokenMetadata,
} from '@/app/api/auth/notion/types';
import { type Attachment } from 'ai';
import {
  boolean,
  index,
  integer,
  json,
  jsonb,
  pgSchema,
  text,
  timestamp,
  unique,
  uuid,
  vector,
} from 'drizzle-orm/pg-core';
import Stripe from 'stripe';
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
  isSuperAdmin: boolean('is_super_admin').notNull().default(false),
  customerId: text('customer_id'),
  customFreeTrial: boolean('custom_free_trial').default(false).notNull(),
  settings: json('settings').$type<UserSettings>(),
  createdAt: timestamp('created_at', { mode: 'date', withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { mode: 'date', withTimezone: true })
    .defaultNow()
    .notNull()
    .$onUpdate(() => new Date()),
});

export type UserRow = typeof userTable.$inferSelect;
export type InsertUserRow = typeof userTable.$inferInsert;

export const customerSubscriptionsStripeTable = appSchema.table('customer_subscriptions_stripe', {
  customerId: text('customer_id').primaryKey(),
  subscriptions: json('subscriptions').$type<Stripe.Subscription[]>().notNull(),
  createdAt: timestamp('created_at', { mode: 'date', withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { mode: 'date', withTimezone: true })
    .defaultNow()
    .notNull()
    .$onUpdate(() => new Date()),
});

export type CustomerSubscriptionsStripeInsertModel =
  typeof customerSubscriptionsStripeTable.$inferInsert;
export type CustomerSubscriptionsStripeModel = typeof customerSubscriptionsStripeTable.$inferSelect;

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
  assistantId: uuid('assistant_id').references(() => assistantTable.id),
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
  attachments: json('attachments').$type<Attachment[]>(),
  metadata: json('metadata').$type<ConversationMessageMetadata>(),
  createdAt: timestamp('created_at', { mode: 'date', withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { mode: 'date', withTimezone: true })
    .defaultNow()
    .notNull()
    .$onUpdate(() => new Date()),
});

export type ConversationMessageRow = typeof conversationMessageTable.$inferSelect;
export type InsertConversationMessageRow = typeof conversationMessageTable.$inferInsert;

export const assistantTable = appSchema.table('assistant', {
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

export type AssistantRow = typeof assistantTable.$inferSelect;
export type InsertAssistantRow = typeof assistantTable.$inferInsert;

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

const modelTypeSchema = z.enum(['text', 'image']);
export const modelTypePgEnum = appSchema.enum('model_type', modelTypeSchema.options);
export type ModelType = z.infer<typeof modelTypeSchema>;

const aiProviderSchema = z.enum(['openai', 'google', 'anthropic', 'mistral', 'xai']);
export const aiProviderPgEnum = appSchema.enum('ai_provider', aiProviderSchema.options);
export type AIProvider = z.infer<typeof aiProviderSchema>;

export type AIModelFeatures = {
  vision: boolean;
  files: boolean;
};

export const aiModelTable = appSchema.table('ai_model', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  description: text('description').notNull(),
  type: modelTypePgEnum('type').notNull(),
  provider: aiProviderPgEnum('provider').notNull(),
  isEnabled: boolean('is_enabled').default(false).notNull(),
  isDefault: boolean('is_default').default(false).notNull(),
  features: jsonb('features')
    .$type<AIModelFeatures>()
    .default({ vision: true, files: true })
    .notNull(),
  createdAt: timestamp('created_at', { mode: 'date', withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { mode: 'date', withTimezone: true })
    .defaultNow()
    .notNull()
    .$onUpdate(() => new Date()),
});

export type AIModelRow = typeof aiModelTable.$inferSelect;
export type InsertAIModelRow = typeof aiModelTable.$inferInsert;

export const conversationUsageTrackingTable = appSchema.table('conversation_usage_tracking', {
  id: uuid('id').defaultRandom().primaryKey(),
  modelId: text('model_id').notNull(),
  conversationId: uuid('conversation_id').notNull(),
  userId: uuid('user_id').notNull(),
  completionTokens: integer('completion_tokens').notNull(),
  promptTokens: integer('prompt_tokens').notNull(),
  createdAt: timestamp('created_at', { mode: 'date', withTimezone: true }).defaultNow().notNull(),
});

export type ConversationUsageTrackingRow = typeof conversationUsageTrackingTable.$inferSelect;
export type InsertConversationUsageTrackingRow = typeof conversationUsageTrackingTable.$inferInsert;

export const subscriptionLimitsSchema = z.object({
  tokenLimit: z.number().nullable(),
  messagesLimit: z.number().nullable(),
});

export type SubscriptionLimits = z.infer<typeof subscriptionLimitsSchema>;

export const subscriptionPlanIdSchema = z.enum(['free', 'premium']);
export const subscriptionPlanIdPgEnum = appSchema.enum(
  'subscription_id',
  subscriptionPlanIdSchema.options,
);

export const subscriptionPlanTable = appSchema.table('subscription_plan', {
  id: subscriptionPlanIdPgEnum('id').primaryKey(),
  name: text('name').notNull(),
  price: integer('price').notNull(),
  description: text('description').notNull(),
  limits: json('limits').$type<SubscriptionLimits>().notNull(),
  createdAt: timestamp('created_at', { mode: 'date', withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { mode: 'date', withTimezone: true })
    .defaultNow()
    .notNull()
    .$onUpdate(() => new Date()),
});

export type SubscriptionPlanRow = typeof subscriptionPlanTable.$inferSelect;
export type InsertSubscriptionPlanRow = typeof subscriptionPlanTable.$inferInsert;

export const fileTable = appSchema.table('file', {
  id: uuid('id').defaultRandom().primaryKey(),
  name: text('name').notNull(),
  size: integer('size').notNull(),
  mimeType: text('mime_type').notNull(),
  s3BucketKey: text('s3_bucket_key').notNull(),
  content: text('content'),
  userId: uuid('user_id')
    .references(() => userTable.id)
    .notNull(),
  folderId: uuid('folder_id').references(() => folderTable.id),
  createdAt: timestamp('created_at', { mode: 'date', withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { mode: 'date', withTimezone: true })
    .defaultNow()
    .notNull()
    .$onUpdate(() => new Date()),
});

export type FileRow = typeof fileTable.$inferSelect;
export type InsertFileRow = typeof fileTable.$inferInsert;

export const fileEmbeddingTable = appSchema.table(
  'file_embedding_table',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    fileId: uuid('file_id')
      .references(() => fileTable.id)
      .notNull(),
    // chunk: text('chunk').notNull(),
    embedding: vector('embedding', { dimensions: 1536 }).notNull(),
    content: text('content').notNull(),
    // offsetStart: integer('offset_start').notNull(),
    // offsetEnd: integer('offset_end').notNull(),
    createdAt: timestamp('created_at', { mode: 'date', withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp('updated_at', { mode: 'date', withTimezone: true })
      .defaultNow()
      .notNull()
      .$onUpdate(() => new Date()),
  },
  (table) => ({
    embeddingIndex: index('embeddingIndex').using('hnsw', table.embedding.op('vector_cosine_ops')),
  }),
);

export type FileEmbeddingRow = typeof fileEmbeddingTable.$inferSelect;
export type InsertFileEmbeddingRow = typeof fileEmbeddingTable.$inferInsert;

export const folderTable = appSchema.table('folder', {
  id: uuid('id').defaultRandom().primaryKey(),
  name: text('name').notNull(),
  userId: uuid('user_id')
    .references(() => userTable.id)
    .notNull(),
  createdAt: timestamp('created_at', { mode: 'date', withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { mode: 'date', withTimezone: true })
    .defaultNow()
    .notNull()
    .$onUpdate(() => new Date()),
});

export type FolderRow = typeof folderTable.$inferSelect;
export type InsertFolderRow = typeof folderTable.$inferInsert;
