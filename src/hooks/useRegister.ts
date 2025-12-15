/**
 * Hook personalizado para gerenciar o registro de ponto.
 * Centraliza a lógica de acesso e manipulação dos registros.
 */

import { database } from '@/db'
import { schema } from '@/db/schema'
import { RegisterInsert } from '@/db/schema/registers'
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

    try {
      const request = await fetch('https://extractor.nexsdev.com.br/extract', {
        method: 'POST',
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        body: formData,
      })
      console.info(request)
      const { date, time, nsr } = (await request.json()) as {
        date: string
        time: string
        nsr: string
      }
      setLoading(false)

      return { date, time, nsr }

    } catch (error) {
      setError('Erro ao extrair dados da foto')
      throw error
    }
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
        .insert(schema.registers)
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
        .update(schema.registers)
        .set({ ...data, updatedAt: new Date() })
        .where(eq(schema.registers.id, id))

      return true
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao atualizar registro'
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

      const result = await database.select().from(schema.registers).where(eq(schema.registers.id, id))

      return result[0] || null
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao localizar registro'
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

      await database.delete(schema.registers).where(eq(schema.registers.id, id))

      return true
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao excluir registro'
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
