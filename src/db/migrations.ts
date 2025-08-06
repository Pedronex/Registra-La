/**
 * Configuração de migrações do banco de dados WatermelonDB
 */
import { schemaMigrations } from '@nozbe/watermelondb/Schema/migrations';

/**
 * Definição das migrações do esquema do banco de dados
 * 
 * As migrações são executadas em ordem crescente de versão quando o esquema do banco
 * é atualizado. Cada migração deve conter as alterações necessárias para transformar
 * o esquema da versão anterior para a nova versão.
 */
export default schemaMigrations({
  migrations: [
    // As migrações serão adicionadas aqui quando necessário
    // Exemplo de migração:
    // {
    //   toVersion: 2,
    //   steps: [
    //     addColumns({
    //       table: 'config',
    //       columns: [
    //         { name: 'new_setting', type: 'boolean' }
    //       ]
    //     })
    //   ]
    // }
  ],
});