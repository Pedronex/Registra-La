import { Header } from "@/components/Header";
import { History } from "@/components/History";
import { useConfig } from "@/hooks/useConfig";
import { Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

/**
 * Página principal do aplicativo após login
 * Exibe o histórico de ponto e opções para configurar e registrar.
 */
export default function HomePage() {
  const { loading } = useConfig();
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
    </SafeAreaView>
  );
}
