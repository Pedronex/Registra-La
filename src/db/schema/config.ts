import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core'

export const config = sqliteTable('config', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  tolerance: integer('tolerance'),
  workDays: text('work_days', { mode: 'json' }).default([]),
  workHours: integer('work_hours').notNull(),
  companyName: text('company_name'),
  initialBalanceInMinutes: integer('initial_balance').default(0),
  entraceTime: integer('entrace_time').notNull(),
  exitTime: integer('exit_time').notNull(),
  entraceBufferTime: integer('entrace_buffer_time').default(0),
  exitBufferTime: integer('exit_buffer_time').default(0),

  notifications: integer('notifications', { mode: 'boolean' }).default(true).notNull(),

  // Metadados
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull().default(new Date()),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).notNull().default(new Date()),
})

export type ConfigData = typeof config.$inferSelect & {
  workDays: number[]
}
export type ConfigInsert = typeof config.$inferInsert & {
  workDays: number[]
}
