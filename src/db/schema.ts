/**
 * Definição do esquema do banco de dados Drizzle ORM
 */
import { sql } from 'drizzle-orm';
import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';

/**
 * Esquema da tabela de registros
 */
export const registersTable = sqliteTable('registers', {
  id: integer('id').primaryKey({ autoIncrement: true }),

  // Informações básicas do registro
  type: text('type', {enum: ['folga', 'trabalho', 'atestado']}).notNull(),
  time: text('time').notNull(),
  date: text('date').notNull(),
  isFullDay: integer('is_full_day', { mode: 'boolean' }).notNull().default(false),

  // Informações adicionais
  photo: text('photo'),
  location: text('location'),
  description: text('description'),
  nsr: text('nsr'),

  // Metadados
  createdAt: integer('created_at').notNull().default(sql`CURRENT_TIMESTAMP`),
  updatedAt: integer('updated_at').notNull().default(sql`CURRENT_TIMESTAMP`),
});

/**
 * Esquema da tabela de configurações
 */
export const configTable = sqliteTable('config', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  workHours: integer('work_hours').notNull(),
  tolerance: integer('tolerance'),
  breakTime: integer('break_time'),
  workDays: text('work_days', {mode:'json'}),
  companyName: text('company_name'),
  geminiApiKey: text('gemini_api_key'),

  // Metadados
  createdAt: integer('created_at').notNull().default(sql`CURRENT_TIMESTAMP`),
  updatedAt: integer('updated_at').notNull().default(sql`CURRENT_TIMESTAMP`),
});

/**
 * Tipos para configurações
 */
export type ConfigData = typeof configTable.$inferSelect;
export type ConfigInsert = typeof configTable.$inferInsert;

/**
 * Tipos para registros
 */

export type RegisterData = typeof registersTable.$inferSelect;
export type RegisterInsert = typeof registersTable.$inferInsert;


