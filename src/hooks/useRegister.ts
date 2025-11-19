/**
 * Hook personalizado para gerenciar o registro de ponto.
 * Centraliza a lógica de acesso e manipulação dos registros.
 */

import { database } from '@/db'
import { RegisterInsert, registersTable } from '@/db/schema'
import { eq } from 'drizzle-orm'
import { useCallback, useState } from 'react'
/**
 * Hook para gerenciar o registro de ponto
 */
export function useRegister() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  /**
   * Coletar dados da foto do registro de ponto
   */
  const extractDataPhoto = useCallback(async (formData: FormData) => {
    setLoading(true)

    const request = await fetch('https://pontola-645173022183.us-central1.run.app/extract', {
      method: 'POST',
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      body: formData,
    })
    const { date, time, nsr } = await request.json() as {
      date: string
      time: string
      nsr: string
    }
    setLoading(false)

    return { date, time, nsr }
  }, [])

  /**
   * Salva um novo registro de ponto
   */
  const saveRegister = useCallback(async (data: RegisterInsert) => {
    console.log(data)

    try {
      setLoading(true)
      setError(null)

      await database
        .insert(registersTable)
        .values({ ...data, createdAt: new Date(), updatedAt: new Date() })

      return true
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao salvar registro'
      setError(errorMessage)
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  /**
   * Atualiza o registro de ponto
   */
  const editRegister = useCallback(async (id: number, data: Partial<RegisterInsert>) => {
    try {
      setLoading(true)
      setError(null)

      await database
        .update(registersTable)
        .set({ ...data, updatedAt: new Date() })
        .where(eq(registersTable.id, id))

      return true
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error updating record'
      setError(errorMessage)
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  /**
   * Localizar o registro pelo ID
   */
  const findById = useCallback(async (id: number) => {
    try {
      setLoading(true)
      setError(null)

      const result = await database.select().from(registersTable).where(eq(registersTable.id, id))

      return result[0] || null
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error finding record'
      setError(errorMessage)
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  /**
   * Delete a record by ID
   */
  const deleteRegister = useCallback(async (id: number) => {
    try {
      setLoading(true)
      setError(null)

      await database.delete(registersTable).where(eq(registersTable.id, id))

      return true
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error deleting record'
      setError(errorMessage)
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  return {
    loading,
    error,
    saveRegister,
    editRegister,
    findById,
    deleteRegister,
    extractDataPhoto,
  }
}
