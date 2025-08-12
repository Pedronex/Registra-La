import { Link } from "expo-router";
import { Text, TouchableOpacity, View } from "react-native";

import { Header } from "@/components/Header";
import { useConfig } from "@/hooks/useConfig";
import { useThemeColor } from "@/hooks/useThemeColor";
import { useEffect, useState } from "react";

/**
 * Página principal do aplicativo após login
 * Exibe opções para configurar e registrar ponto
 */
export default function HomePage() {
  // Estados
  const [isConfigured, setIsConfigured] = useState(false);

  // Hooks
  const { config, loading } = useConfig();
  const backgroundColor = useThemeColor(
    { light: "#F5F5F5", dark: "#1F2937" },
    "background"
  );
  const primaryColor = useThemeColor(
    { light: "#3B82F6", dark: "#3B82F6" },
    "primary"
  );
  const textColor = useThemeColor(
    { light: "#FFFFFF", dark: "#FFFFFF" },
    "text"
  );

  // Verifica se o aplicativo está configurado
  useEffect(() => {
    if (config && config.workHours > 0) {
      setIsConfigured(true);
    }
  }, [config]);

  /**
   * Renderiza o cabeçalho da página
   */
  const renderHeader = () => (
    <View className="justify-center content-center items-center mt-10">
      <Header title="Página Inicial" />
    </View>
  );

  /**
   * Renderiza o botão de configuração
   */
  const renderConfigButton = () => (
    <View className="justify-center content-center items-center">
      <Link href="/config" asChild>
        <TouchableOpacity
          style={{ backgroundColor: primaryColor }}
          className="px-4 py-3 bg-blue-500 rounded-lg"
          accessibilityRole="button"
          accessibilityLabel="Configurar aplicativo"
        >
          <Text style={{ color: textColor }} className="text-center text-white">
            Configurar
          </Text>
        </TouchableOpacity>
      </Link>
    </View>
  );

  /**
   * Renderiza o botão de registro de ponto
   */
  const renderRegisterButton = () => (
    <View className="justify-center content-center items-center">
      {isConfigured && (
        <Link href="/register" asChild>
          <TouchableOpacity
            style={{ backgroundColor: primaryColor }}
            className="px-4 py-3 bg-blue-500 rounded-lg"
            accessibilityRole="button"
            accessibilityLabel="Registrar ponto"
          >
            <Text
              style={{ color: textColor }}
              className="text-center text-white"
            >
              Registrar
            </Text>
          </TouchableOpacity>
        </Link>
      )}
    </View>
  );

  // Exibe mensagem de carregamento enquanto busca configurações
  if (loading) {
    return (
      <View className="justify-center items-center w-screen h-screen bg-neutral-100 dark:bg-gray-800">
        <Text>Carregando...</Text>
      </View>
    );
  }

  return (
    <View
      className="justify-between items-center p-10 w-screen h-screen bg-neutral-100 dark:bg-gray-800"
      style={{ backgroundColor }}
    >
      {renderHeader()}
      {renderConfigButton()}
      {renderRegisterButton()}
    </View>
  );
}
