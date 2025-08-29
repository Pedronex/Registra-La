/**
 * Hook personalizado para gerenciar o registro de ponto.
 * Centraliza a lógica de acesso e manipulação dos registros.
 */

import { database } from '@/db';
import { RegisterInsert, registersTable } from '@/db/schema';
import { useCallback, useState } from 'react';

/**
 * Hook para gerenciar o registro de ponto
 */
export function useRegister() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    /**
     * Salva um novo registro de ponto
     */
    const saveRegister = useCallback(async (data: RegisterInsert) => {
        try {
            setLoading(true);
            setError(null);

            await database.insert(registersTable).values(data);

            return true;
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Erro ao salvar registro';
            setError(errorMessage);
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);

    return {
        loading,
        error,
        saveRegister,
    };
}