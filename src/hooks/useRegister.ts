/**
 * Hook personalizado para gerenciar as configurações do aplicativo.
 * Centraliza a lógica de acesso e manipulação das configurações.
 */

import { database } from '@/db';
import { RegisterData, RegisterInsert, registersTable } from '@/db/schema';
import { useCallback, useEffect, useState } from 'react';

/**
 * Hook para gerenciar configurações do aplicativo
 */
export function useConfig() {
    const [registers, setRegisters] = useState<RegisterData[]>([]);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    /**
     * Carrega as configurações do aplicativo
     */
    const loadRegisters = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);

            const registers = await database.select().from(registersTable);
            setRegisters(registers);


            return registers;
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
    const saveConfig = useCallback(async (data: RegisterInsert) => {
        try {
            setLoading(true);
            setError(null);

            await database.insert(registersTable).values(data).onConflictDoUpdate({
                target: registersTable.id,
                set: data,
            })

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
        loadRegisters();
    }, [loadRegisters]);

    return {
        registers,
        loading,
        error,
        loadRegisters,
        saveConfig,
    };
}