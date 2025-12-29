/**
 * Hook personalizado para gerenciar as configurações do aplicativo.
 * Centraliza a lógica de acesso e manipulação das configurações.
 */

import { database } from '@/db'
import { schema } from '@/db/schema'
import { ConfigData, ConfigInsert } from '@/db/schema/config'
import { scheduleWorkdayNotifications } from '@/lib/notifications'
import { desc } from 'drizzle-orm'
import { useCallback, useEffect, useState } from 'react'

/**
 * Hook para gerenciar configurações do aplicativo
 */
export function useConfig() {
  const [config, setConfig] = useState<ConfigData | null>(null)

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  /**
   * Carrega as configurações do aplicativo
   */
  const loadConfig = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)

      const [config] = await database
        .select()
        .from(schema.config)
        .limit(1)
        .orderBy(desc(schema.config.id))

      setConfig({...config, workDays: Array.isArray(config.workDays) ? config.workDays : []})

      return config
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao carregar configurações'
      setError(errorMessage)
      return null
    } finally {
      setLoading(false)
    }
  }, [])

  /**
   * Salva as configurações do aplicativo
   */
  const saveConfig = useCallback(async (configData: Omit<ConfigInsert, 'workHours' | 'id'>) => {
    try {
      setLoading(true)
      setError(null)

      /* 
        example fulltime:
        entraceTime = 480 (08:00)
        entraceBufferTime = 720 (12:00)
        exitBufferTime = 840 (14:00)
        exitTime = 1800 (18:00)

        (1800 - 800) + (720 - 840)
        600 + -120
        480 (08:00)

        example halftime:

        entraceTime = 480 (08:00)
        entraceBufferTime = 0 (undefined)
        exitBufferTime = 0 (undefined)
        exitTime = 720 (12:00)

        (720 - 480) + (0 - 0)
        240 + 0
        240 (04:00)
      */

      const calculateWorkHours = (configData.exitTime - configData.entraceTime) + ((configData.entraceBufferTime || 0) - (configData.exitBufferTime || 0))

      const [config] = await database.insert(schema.config).values({
        ...configData,
        workHours: calculateWorkHours,
      }).onConflictDoUpdate({
        target: schema.config.id,
        set: configData,
      }).returning()

      scheduleWorkdayNotifications({...config, workDays: Array.isArray(config.workDays) ? config.workDays : []})

      setConfig({...config, workDays: Array.isArray(config.workDays) ? config.workDays : []})

      return true
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao salvar configurações'
      setError(errorMessage)
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  // Carrega as configurações ao montar o componente
  useEffect(() => {
    loadConfig()
  }, [loadConfig])

  return {
    config,
    loading,
    error,
    loadConfig,
    saveConfig,
  }
}
