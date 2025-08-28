import { Link } from "expo-router";
import { Text, View } from "react-native";

import { Header } from "@/components/Header";
import { useConfig } from "@/hooks/useConfig";
import { useThemeColor } from "@/hooks/useThemeColor";

/**
 * Página inicial do aplicativo
 * Apresenta o aplicativo e fornece acesso à configuração
 */
export default function InitialPage() {
  const {config} = useConfig();


  // Obtém cores do tema atual
  const backgroundColor = useThemeColor(
    { light: "#F5F5F5", dark: "#1F2937" },
    "background"
  );
  const textColor = useThemeColor(
    { light: "#000000", dark: "#FFFFFF" },
    "text"
  );
  const buttonColor = useThemeColor(
    { light: "#60A5FA", dark: "#2563EB" },
    "primary"
  );

  /**
   * Renderiza o cabeçalho da página
   */
  const renderHeader = () => (
    <View className="justify-center content-center items-center mt-10">
      <Header />
    </View>
  );

  /**
   * Renderiza o slogan do aplicativo
   */
  const renderSlogan = () => (
    <View>
      <Text
        className="text-3xl text-black dark:text-white text-start"
        style={{ color: textColor }}
        accessibilityRole="text"
      >
        Gerencie sua jornada com simplicidade.
      </Text>
    </View>
  );

  /**
   * Renderiza o botão de entrada
   */
  const renderEnterButton = () => (
    <Link
      href={config?.id ? `/home` : `/config`}
      className="p-2 mt-5 w-full bg-blue-400 rounded-3xl dark:bg-blue-600"
      style={{ backgroundColor: buttonColor }}
      accessibilityRole="button"
      accessibilityLabel="Entrar no aplicativo"
    >
      <Text
        className="text-3xl font-bold text-center text-black dark:text-white"
        style={{ color: textColor }}
      >
        Entrar
      </Text>
    </Link>
  );

  return (
    <View
      className={`justify-between items-center p-10 w-screen h-screen bg-[${backgroundColor}]`}
    >
      {renderHeader()}
      {renderSlogan()}
      {renderEnterButton()}
    </View>
  );
}
