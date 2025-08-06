/**
 * Configuração e inicialização do banco de dados WatermelonDB
 */

import { Database } from "@nozbe/watermelondb";
import SQLiteAdapter from "@nozbe/watermelondb/adapters/sqlite";

import { Config } from "@/model/Config";
import { Register } from "@/model/Register";
import migrations from "./migrations";
import schema from "./schema";

/**
 * Nome do banco de dados
 */
const DATABASE_NAME = "registra";

/**
 * Cria o adaptador SQLite para o banco de dados
 */
const adapter = new SQLiteAdapter({
  schema,
  migrations,
  dbName: DATABASE_NAME,
  // JSI é recomendado para iOS, mas pode causar problemas no Android
  jsi: false,
  // Tratamento de erros na configuração do banco
  onSetUpError: (error) => {
    console.error("Erro na configuração do banco de dados:", error);
  },
});

/**
 * Inicializa o banco de dados com o adaptador
 */
export const database = new Database({
  adapter,
  modelClasses: [Register, Config],
});

/**
 * Coleções para acesso aos modelos
 */
export const registerCollection = database.get<Register>("registers");
export const configCollection = database.get<Config>("config");

/**
 * API de armazenamento local simplificada para dados não relacionais
 */
export const localStorage = {
  /**
   * Salva um valor com uma chave específica
   * @param key Chave para armazenamento
   * @param value Valor a ser armazenado
   */
  set: async (key: string, value: any): Promise<void> => {
    // Implementação simplificada para compatibilidade
    if (key === "Register" && value) {
      try {
        const configs = await configCollection.query().fetch();
        
        await database.write(async () => {
          if (configs.length > 0) {
            await configs[0].update(record => {
              record.workHours = value.workHours;
              record.tolerance = value.tolerance;
            });
          } else {
            await configCollection.create(record => {
              record.workHours = value.workHours;
              record.tolerance = value.tolerance;
            });
          }
        });
      } catch (error) {
        console.error("Erro ao salvar no localStorage:", error);
        throw error;
      }
    }
  },
  
  /**
   * Obtém um valor pela chave
   * @param key Chave do valor armazenado
   */
  get: async (key: string): Promise<any> => {
    // Implementação simplificada para compatibilidade
    if (key === "Register") {
      try {
        const configs = await configCollection.query().fetch();
        if (configs.length > 0) {
          return {
            workHours: configs[0].workHours,
            tolerance: configs[0].tolerance,
          };
        }
        return null;
      } catch (error) {
        console.error("Erro ao obter do localStorage:", error);
        throw error;
      }
    }
    return null;
  },
};
