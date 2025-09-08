/**
 * Hook personalizado para gerenciar atualizações.
 * Centraliza a lógica de acesso e manipulação das atualizações.
 */

import * as Updates from "expo-updates";
import { useCallback, useEffect, useState } from 'react';

/**
 * Hook para gerenciar atualizações
 */
export function useUpdate() {
    const [updateAvailable, setUpdateAvailable] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    /**
     * Carrega as atualizações disponíveis
     */
    const loadUpdates = useCallback(async () => {
        if (!Updates.isEmbeddedLaunch) {
            setUpdateAvailable(false);
            return;
        }

        try {
            setLoading(true);
            setError(null);

            const result = await Updates.checkForUpdateAsync();
            setUpdateAvailable(result.isAvailable);

            return result;
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Erro ao carregar atualizações';
            setError(errorMessage);
            return null;
        } finally {
            setLoading(false);
        }
    }, []);

    /**
     * Atualiza o aplicativo
     */
    const updateApp = useCallback(async () => {
        try {
            await Updates.fetchUpdateAsync();
            await Updates.reloadAsync();
        } catch (error) {
            console.error("Erro ao atualizar:", error);
        }
    }, []);

    // Carrega as atualizações ao montar o componente
    useEffect(() => {
        loadUpdates();
    }, [loadUpdates]);

    return {
        updateAvailable,
        loading,
        error,
        loadUpdates,
        updateApp
    };
}