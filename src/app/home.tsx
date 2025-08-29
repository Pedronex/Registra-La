import { Header } from "@/components/Header";
import { History } from "@/components/History";
import { useConfig } from "@/hooks/useConfig";
import { useTheme } from "@/providers/ThemeProvider";
import { Entypo } from "@expo/vector-icons";
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
  const { theme } = useTheme();

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
      <View className="flex-row justify-end p-4">
        {isConfigured && (
          <Link href="/register" asChild>
            <TouchableOpacity
              className="rounded-full bg-primary"
              accessibilityRole="button"
              accessibilityLabel="Registrar ponto"
            >
              <Entypo
                name="plus"
                size={50}
                color={theme === "dark" ? "#6750A4" : "#D0BCFF"}
              />
            </TouchableOpacity>
          </Link>
        )}
      </View>
    </SafeAreaView>
  );
}
