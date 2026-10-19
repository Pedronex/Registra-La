import * as Updates from 'expo-updates'
import { useCallback, useEffect, useState } from 'react'

export function useUpdate() {
  const [updateAvailable, setUpdateAvailable] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // evita check em dev client
  const checkForUpdate = useCallback(async () => {
    if (__DEV__) return null
    return Updates.checkForUpdateAsync()
  }, [])

  const loadUpdates = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const result = await checkForUpdate()
      setUpdateAvailable(result?.isAvailable ?? false)
      return result
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao carregar atualizações'
      setError(errorMessage)
      return null
    } finally {
      setLoading(false)
    }
  }, [checkForUpdate])

  const updateApp = useCallback(async () => {
    try {
      await Updates.fetchUpdateAsync()
      await Updates.reloadAsync()
    } catch (error) {
      console.error('Erro ao atualizar:', error)
    }
  }, [])

  // Verificação inicial: setState apenas em callbacks assíncronos
  useEffect(() => {
    let ignore = false
    checkForUpdate()
      .then((result) => {
        if (!ignore) setUpdateAvailable(result?.isAvailable ?? false)
      })
      .catch((err) => {
        if (!ignore) {
          setError(err instanceof Error ? err.message : 'Erro ao carregar atualizações')
        }
      })
      .finally(() => {
        if (!ignore) setLoading(false)
      })
    return () => {
      ignore = true
    }
  }, [checkForUpdate])

  return { updateAvailable, loading, error, loadUpdates, updateApp }
}
