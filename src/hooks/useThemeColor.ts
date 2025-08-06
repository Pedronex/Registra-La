/**
 * Hook para obter cores baseadas no tema atual (claro ou escuro)
 * 
 * Este hook permite obter cores do tema atual do sistema, com a possibilidade
 * de sobrescrever cores específicas através de props.
 * 
 * @see https://docs.expo.dev/guides/color-schemes/
 */

import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';

/**
 * Tipo para as propriedades de cores específicas por tema
 */
export type ThemeColorProps = {
  light?: string;
  dark?: string;
};

/**
 * Tipo para as chaves de cores disponíveis no tema
 */
export type ColorName = keyof typeof Colors.light & keyof typeof Colors.dark;

/**
 * Hook para obter a cor apropriada baseada no tema atual
 * 
 * @param props Propriedades com cores específicas para temas claro e escuro
 * @param colorName Nome da cor no objeto de tema
 * @returns A cor apropriada para o tema atual
 */
export function useThemeColor(
  props: ThemeColorProps,
  colorName: ColorName
): string {
  // Obtém o tema atual do sistema, com fallback para 'light'
  const theme = useColorScheme() ?? 'light';
  
  // Verifica se existe uma cor específica nas props para o tema atual
  const colorFromProps = props[theme];

  // Retorna a cor das props se existir, ou a cor do tema global
  return colorFromProps || Colors[theme][colorName];
}
