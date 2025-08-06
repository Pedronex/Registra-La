/**
 * Hook personalizado para gerenciar as configurações do aplicativo.
 * Centraliza a lógica de acesso e manipulação das configurações.
 */

import { useState, useEffect, useCallback } from 'react';
import { storageService, ConfigData } from '@/services/StorageService';

/**
 * Hook para gerenciar configurações do aplicativo
 */
export function useConfig() {
  const [config, setConfig] = useState<ConfigData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  /**
   * Carrega as configurações do aplicativo
   */
  const loadConfig = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const appConfig = await storageService.getConfig();
      setConfig(appConfig);
      
      return appConfig;
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
  const saveConfig = useCallback(async (configData: ConfigData) => {
    try {
      setLoading(true);
      setError(null);
      
      await storageService.saveConfig(configData);
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