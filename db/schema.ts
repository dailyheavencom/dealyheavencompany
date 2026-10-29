import { pgTable, text, jsonb, timestamp, primaryKey } from 'drizzle-orm/pg-core';

export const demoState = pgTable('demo_state', {
  sessionId: text('session_id').notNull(),
  key: text('key').notNull(),
  value: jsonb('value').notNull(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
}, (table) => [primaryKey({ columns: [table.sessionId, table.key] })]);
