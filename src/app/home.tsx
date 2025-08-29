import { Link } from "expo-router";
import { Text, TouchableOpacity, View } from "react-native";

import { Header } from "@/components/Header";
import { useConfig } from "@/hooks/useConfig";
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

  // Verifica se o aplicativo está configurado
  useEffect(() => {
    if (config && config.workHours > 0) {
      setIsConfigured(true);
    }
  }, [config]);

  /**
   * Renderiza o cabeçalho da página
   */
  const renderHeader = () => <Header title="Página Inicial" />;

  /**
   * Renderiza o botão de configuração
   */
  const renderConfigButton = () => (
    <View className="justify-center content-center items-center">
      <Link href="/config" asChild>
        <TouchableOpacity
          className="px-4 py-3 rounded-lg bg-primary"
          accessibilityRole="button"
          accessibilityLabel="Configurar aplicativo"
        >
          <Text className="text-center text-primary-content">Configurar</Text>
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
            className="px-4 py-3 rounded-lg bg-primary"
            accessibilityRole="button"
            accessibilityLabel="Registrar ponto"
          >
            <Text className="text-center text-primary-content">Registrar</Text>
          </TouchableOpacity>
        </Link>
      )}
    </View>
  );

  // Exibe mensagem de carregamento enquanto busca configurações
  if (loading) {
    return (
      <View className="justify-center items-center w-screen h-screen bg-background">
        <Text>Carregando...</Text>
      </View>
    );
  }

  return (
    <View className="justify-between items-center p-10 w-screen h-screen bg-background">
      {renderHeader()}
      {renderConfigButton()}
      {renderRegisterButton()}
    </View>
  );
}
