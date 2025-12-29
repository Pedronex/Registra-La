import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core'

export const registers = sqliteTable('registers', {
  id: integer('id').primaryKey({ autoIncrement: true }),

  // Informações básicas do registro
  type: text('type', { enum: ['folga', 'trabalho', 'atestado', 'saldo'] }).notNull(),
  timeInMinutes: integer('time').notNull().default(0),
  date: text('date').notNull(),
  isFullDay: integer('is_full_day', { mode: 'boolean' }).notNull().default(false),

  // Informações adicionais
  photo: text('photo'),
  location: text('location'),
  description: text('description'),
  nsr: text('nsr'),

  // Metadados
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull(),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).notNull(),
})

export type RegisterData = typeof registers.$inferSelect
export type RegisterInsert = typeof registers.$inferInsert
