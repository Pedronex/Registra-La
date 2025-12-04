import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core'

export const config = sqliteTable('config', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  workHours: integer('work_hours').notNull(),
  tolerance: integer('tolerance'),
  breakTime: integer('break_time'),
  workDays: text('work_days', { mode: 'json' }).default([]),
  companyName: text('company_name'),
  initialBalanceInMinutes: integer('initial_balance').default(0),

  // Metadados
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull().default(new Date()),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).notNull().default(new Date()),
})

export type ConfigData = typeof config.$inferSelect
export type ConfigInsert = typeof config.$inferInsert
