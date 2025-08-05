import { View } from "react-native";

import { useThemeColor } from "@/hooks/useThemeColor";

/**
 * Página de registro de ponto
 * Permite o usuário registrar o seu ponto
 */
export default function RegisterPage() {
const backgroundColor = useThemeColor({ light: "#F5F5F5", dark: "#1F2937" }, "background");

  return (
    <View 
      className="justify-between items-center p-10 w-screen h-screen bg-neutral-100 dark:bg-gray-800"
      style={{ backgroundColor }}
    >

    </View>
  );
}
