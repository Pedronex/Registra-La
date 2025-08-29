import { Header } from "@/components/Header";
import { History } from "@/components/History";
import { useConfig } from "@/hooks/useConfig";
import { Link } from "expo-router";
import { useEffect, useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

/**
 * Página principal do aplicativo após login
 * Exibe o histórico de ponto e opções para configurar e registrar.
 */
export default function HomePage() {
  const [isConfigured, setIsConfigured] = useState(false);
  const { config, loading } = useConfig();

  useEffect(() => {
    if (config && config.workHours > 0) {
      setIsConfigured(true);
    }
  }, [config]);

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center bg-background">
        <Text>Carregando...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-background">
      <Header title="Página Inicial" />
      <View className="flex-1 p-4">
        <History />
      </View>
      <View className="flex-row justify-around p-4 bg-primary-content">
        <Link href="/config" asChild>
          <TouchableOpacity
            className="px-4 py-3 rounded-lg bg-primary"
            accessibilityRole="button"
            accessibilityLabel="Configurar aplicativo"
          >
            <Text className="text-center text-primary-content">Configurar</Text>
          </TouchableOpacity>
        </Link>
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
    </SafeAreaView>
  );
}
