/**
 * Modelo de Registro para armazenamento no WatermelonDB
 */
import { Model } from '@nozbe/watermelondb';
import { date, field, readonly } from '@nozbe/watermelondb/decorators';

/**
 * Tipos de operação permitidos para registros
 */
export type RegisterOperationType = 'add' | 'sub';

/**
 * Tipos de registro
 */
export type RegisterType = 'trabalho' | 'atestado' | 'folga' | 'férias' | 'feriado' | 'outros';

/**
 * Modelo de Registro para armazenamento de pontos, folgas e outros eventos
 */
export class Register extends Model {
  /**
   * Nome da tabela no banco de dados
   */
  static table = 'registers';

  /**
   * Tipo do registro (entrada, saída, folga, etc.)
   */
  @field('type') type!: string;
  
  /**
   * Hora do registro no formato "HH:MM"
   */
  @field('time') time!: string;
  
  /**
   * Data do registro no formato "YYYY-MM-DD"
   */
  @field('date') date!: string;
  
  /**
   * Caminho da foto ou URI base64 (opcional)
   */
  @field('photo') photo?: string;
  
  /**
   * Coordenadas ou endereço do registro (opcional)
   */
  @field('location') location?: string;
  
  /**
   * Descrição adicional do registro (opcional)
   */
  @field('description') description?: string;
  
  /**
   * Número de série do registro (opcional)
   */
  @field('nsr') nsr?: string;
  
  /**
   * Indica se o registro é para o dia inteiro (ex: folga)
   */
  @field('is_full_day') isFullDay!: boolean;

  /**
   * Hora de início para registros com duração (opcional)
   */
  @field('start_time') startTime?: string;
  
  /**
   * Hora de término para registros com duração (opcional)
   */
  @field('end_time') endTime?: string;
  
  /**
   * Duração em minutos (opcional)
   */
  @field('duration') duration?: number;
  
  /**
   * Operação a ser aplicada (adicionar ou subtrair tempo)
   */
  @field('operation') operation?: RegisterOperationType;

  /**
   * Data de criação do registro (somente leitura)
   */
  @readonly @date('created_at') createdAt!: Date;
  
  /**
   * Data de atualização do registro (somente leitura)
   */
  @readonly @date('updated_at') updatedAt!: Date;
}
