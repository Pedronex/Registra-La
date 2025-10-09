/**
 * Hook personalizado para gerenciar os registros de ponto.
 * Centraliza a lógica de acesso e manipulação dos registros.
 */
import { useCallback, useEffect, useState } from 'react'

import { database } from '@/db'
import { RegisterData, registersTable } from '@/db/schema'
import { eq } from 'drizzle-orm'

/**
 * Hook para gerenciar registros de ponto
 */
export function useTimeRecords(date: string) {
  const [records, setRecords] = useState<RegisterData[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  /**
   * Carrega os registros de ponto para a data especificada
   */
  const loadRecords = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)

      const result = await database
        .select()
        .from(registersTable)
        .where(eq(registersTable.date, date))
      setRecords(result.sort((a, b) => a.time.localeCompare(b.time)))

      return result.sort((a, b) => a.time.localeCompare(b.time))
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao carregar registros'
      setError(errorMessage)
      return null
    } finally {
      setLoading(false)
    }
  }, [date])

  // Carrega os registros ao montar o componente ou quando a data muda
  useEffect(() => {
    loadRecords()
  }, [loadRecords])

  return {
    records,
    loading,
    error,
    loadRecords,
  }
}
