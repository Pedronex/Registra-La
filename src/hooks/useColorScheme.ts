/**
 * Hook para obter o esquema de cores atual do dispositivo
 * 
 * Este arquivo exporta o hook useColorScheme do React Native para uso em ambientes nativos.
 * Para ambientes web, uma implementação específica é fornecida em useColorScheme.web.ts.
 * 
 * @see useColorScheme.web.ts para a implementação específica para web
 */

import { ColorSchemeName, useColorScheme as useNativeColorScheme } from 'react-native';

/**
 * Re-exporta o hook useColorScheme do React Native com tipagem adequada
 */
export function useColorScheme(): ColorSchemeName {
  return useNativeColorScheme();
}