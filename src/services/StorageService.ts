/**
 * Serviço para gerenciar o armazenamento local do aplicativo.
 * Abstrai a lógica de acesso ao banco de dados.
 */

import { Messages } from '@/constants/Messages';
import { configCollection, database, registerCollection } from '@/db';
import { Register } from '@/model/Register';
import { Q } from '@nozbe/watermelondb';

/**
 * Interface para configurações do aplicativo
 */
export interface ConfigData {
  workHours: number;
  tolerance?: number;
}

/**
 * Classe que gerencia o armazenamento local do aplicativo
 */
class StorageService {
  /**
   * Salva as configurações do aplicativo
   * @param config Objeto com as configurações
   */
  async saveConfig(config: ConfigData): Promise<void> {
    try {
      // Verifica se já existe uma configuração
      const existingConfigs = await configCollection.query().fetch();
      
      await database.write(async () => {
        if (existingConfigs.length > 0) {
          // Atualiza a configuração existente
          await existingConfigs[0].update(record => {
            record.workHours = config.workHours;
            record.tolerance = config.tolerance;
          });
        } else {
          // Cria uma nova configuração
          await configCollection.create(record => {
            record.workHours = config.workHours;
            record.tolerance = config.tolerance;
          });
        }
      });
    } catch (error) {
      console.error(Messages.errors.config.save, error);
      throw new Error(Messages.errors.config.save);
    }
  }

  /**
   * Obtém as configurações do aplicativo
   */
  async getConfig(): Promise<ConfigData | null> {
    try {
      const configs = await configCollection.query().fetch();
      
      if (configs.length > 0) {
        const config = configs[0];
        return {
          workHours: config.workHours,
          tolerance: config.tolerance,
        };
      }
      
      return null;
    } catch (error) {
      console.error(Messages.errors.config.load, error);
      throw new Error(Messages.errors.config.load);
    }
  }

  /**
   * Salva um registro no banco de dados
   * @param registerData Dados do registro
   */
  async saveRegister(registerData: Partial<Register>): Promise<Register> {
    try {
      let newRegister: Register;
      
      await database.write(async () => {
        newRegister = await registerCollection.create(record => {
          Object.assign(record, registerData);
        });
      });
      
      return newRegister!;
    } catch (error) {
      console.error(Messages.errors.register.create, error);
      throw new Error(Messages.errors.register.create);
    }
  }

  /**
   * Atualiza um registro existente
   * @param id ID do registro
   * @param registerData Dados atualizados
   */
  async updateRegister(id: string, registerData: Partial<Register>): Promise<Register> {
    try {
      const register = await registerCollection.find(id);
      
      await database.write(async () => {
        await register.update(record => {
          Object.assign(record, registerData);
        });
      });
      
      return register;
    } catch (error) {
      console.error(Messages.errors.register.update, error);
      throw new Error(Messages.errors.register.update);
    }
  }

  /**
   * Obtém todos os registros
   */
  async getAllRegisters(): Promise<Register[]> {
    try {
      return await registerCollection.query().fetch();
    } catch (error) {
      console.error(Messages.errors.register.load, error);
      throw new Error(Messages.errors.register.load);
    }
  }

  /**
   * Obtém registros por data
   * @param date Data no formato YYYY-MM-DD
   */
  async getRegistersByDate(date: string): Promise<Register[]> {
    try {
      return await registerCollection.query(Q.where('date', date)).fetch();
    } catch (error) {
      console.error(Messages.errors.register.load, error);
      throw new Error(Messages.errors.register.load);
    }
  }

  /**
   * Exclui um registro
   * @param id ID do registro
   */
  async deleteRegister(id: string): Promise<void> {
    try {
      const register = await registerCollection.find(id);
      
      await database.write(async () => {
        await register.markAsDeleted();
      });
    } catch (error) {
      console.error(Messages.errors.register.delete, error);
      throw new Error(Messages.errors.register.delete);
    }
  }
}

// Exporta uma instância única do serviço
export const storageService = new StorageService();