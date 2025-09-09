/**
 * Hook personalizado para gerenciar as configurações do aplicativo.
 * Centraliza a lógica de acesso e manipulação das configurações.
 */

import { database } from '@/db';
import { ConfigInsert, configTable } from '@/db/schema';
import { desc } from 'drizzle-orm';
import { useCallback, useEffect, useState } from 'react';

/**
 * Hook para gerenciar configurações do aplicativo
 */
export function useConfig() {
  const [config, setConfig] = useState<ConfigInsert | null>(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  /**
   * Carrega as configurações do aplicativo
   */
  const loadConfig = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const [config] = await database.select().from(configTable).limit(1).orderBy(desc(configTable.id));
      setConfig(config);

      return config;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao carregar configurações';
      setError(errorMessage);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Salva as configurações do aplicativo
   */
  const saveConfig = useCallback(async (configData: ConfigInsert) => {
    try {
      setLoading(true);
      setError(null);

      await database.insert(configTable).values(configData).onConflictDoUpdate({
        target: configTable.id,
        set: configData,
      });

      setConfig(configData);

      return true;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao salvar configurações';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Carrega as configurações ao montar o componente
  useEffect(() => {
    loadConfig();
  }, [loadConfig]);

  return {
    config,
    loading,
    error,
    loadConfig,
    saveConfig,
  };
}