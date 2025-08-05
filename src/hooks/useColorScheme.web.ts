/**
 * Hook para obter o esquema de cores atual do dispositivo (web version)
 * 
 * Esta versão específica para web lida com a hidratação do React para garantir
 * que o esquema de cores seja calculado corretamente no lado do cliente.
 */

import { useEffect, useState } from 'react';
import { ColorSchemeName, useColorScheme as useRNColorScheme } from 'react-native';

/**
 * Hook que retorna o esquema de cores atual do dispositivo
 * 
 * Para suportar renderização estática na web, este valor precisa ser
 * recalculado no lado do cliente após a hidratação do componente.
 * 
 * @returns O esquema de cores atual ('light', 'dark' ou null)
 */
export function useColorScheme(): ColorSchemeName {
  // Estado para controlar se o componente já foi hidratado no cliente
  const [hasHydrated, setHasHydrated] = useState<boolean>(false);

  // Marca o componente como hidratado após a primeira renderização
  useEffect(() => {
    setHasHydrated(true);
  }, []);

  // Obtém o esquema de cores do React Native
  const colorScheme = useRNColorScheme();

  // Retorna o esquema de cores real apenas após a hidratação
  if (hasHydrated) {
    return colorScheme;
  }

  // Fallback para 'light' durante a renderização inicial no servidor
  return 'light';
}
