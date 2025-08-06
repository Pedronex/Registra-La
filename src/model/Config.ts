/**
 * Modelo de Configuração para armazenamento no WatermelonDB
 */
import { Model } from '@nozbe/watermelondb';
import { field, readonly, date } from '@nozbe/watermelondb/decorators';

/**
 * Modelo de Configuração para armazenamento das preferências do usuário
 */
export class Config extends Model {
  /**
   * Nome da tabela no banco de dados
   */
  static table = 'config';

  /**
   * Horas de trabalho por dia (padrão)
   */
  @field('work_hours') workHours!: number;
  
  /**
   * Tolerância em minutos para registros de ponto
   */
  @field('tolerance') tolerance?: number;
  
  /**
   * Data de criação da configuração (somente leitura)
   */
  @readonly @date('created_at') createdAt!: Date;
  
  /**
   * Data de atualização da configuração (somente leitura)
   */
  @readonly @date('updated_at') updatedAt!: Date;
}
