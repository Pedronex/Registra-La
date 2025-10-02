import * as Updates from "expo-updates";
import { useCallback, useEffect, useState } from "react";

export function useUpdate() {
  const [updateAvailable, setUpdateAvailable] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadUpdates = useCallback(async () => {
    if (__DEV__) {
      // evita check em dev client
      setUpdateAvailable(false);
      setLoading(false);
      return null;
    }

    try {
      setLoading(true);
      setError(null);
      const result = await Updates.checkForUpdateAsync();
      setUpdateAvailable(result.isAvailable);
      return result;
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Erro ao carregar atualizações";
      setError(errorMessage);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const updateApp = useCallback(async () => {
    try {
      await Updates.fetchUpdateAsync();
      await Updates.reloadAsync();
    } catch (error) {
      console.error("Erro ao atualizar:", error);
    }
  }, []);

  useEffect(() => {
    loadUpdates();
  }, [loadUpdates]);

  return { updateAvailable, loading, error, loadUpdates, updateApp };
}
