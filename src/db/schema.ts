/**
 * Definição do esquema do banco de dados WatermelonDB
 */
import { appSchema, tableSchema } from "@nozbe/watermelondb";

/**
 * Versão atual do esquema do banco de dados
 */
const SCHEMA_VERSION = 1;

/**
 * Esquema da tabela de registros
 */
const registersSchema = tableSchema({
  name: 'registers',
  columns: [
    // Informações básicas do registro
    { name: 'type', type: 'string' },
    { name: 'time', type: 'string', isOptional: true },
    { name: 'date', type: 'string' },
    { name: 'is_full_day', type: 'boolean' },
    
    // Informações adicionais
    { name: 'photo', type: 'string', isOptional: true },
    { name: 'location', type: 'string', isOptional: true },
    { name: 'description', type: 'string', isOptional: true },
    { name: 'nsr', type: 'string', isOptional: true },

    // Campos para cálculo de duração
    { name: 'start_time', type: 'string', isOptional: true },
    { name: 'end_time', type: 'string', isOptional: true },
    { name: 'duration', type: 'number', isOptional: true },
    { name: 'operation', type: 'string', isOptional: true },

    // Metadados
    { name: 'created_at', type: 'number' },
    { name: 'updated_at', type: 'number' },
  ],
});

/**
 * Esquema da tabela de configurações
 */
const configSchema = tableSchema({
  name: 'config',
  columns: [
    { name: 'work_hours', type: 'number' },
    { name: 'tolerance', type: 'number', isOptional: true },
    
    // Metadados
    { name: 'created_at', type: 'number' },
    { name: 'updated_at', type: 'number' },
  ],
});

/**
 * Esquema completo do aplicativo
 */
export default appSchema({
  version: SCHEMA_VERSION,
  tables: [
    registersSchema,
    configSchema,
  ],
});
