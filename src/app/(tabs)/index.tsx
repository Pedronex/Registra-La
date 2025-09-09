import { Header } from "@/components/Header";
import { History } from "@/components/History";
import { useConfig } from "@/hooks/useConfig";
import { Entypo } from "@expo/vector-icons";
import { Link } from "expo-router";
import { Text, TouchableOpacity, View } from "react-native";
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

      <View className="m-4">
        <Link href="/add" asChild>
          <TouchableOpacity className="flex-row gap-x-4 justify-center items-center p-4 w-full rounded-lg bg-primary">
            <Entypo name="clock" size={24} color="white" />
            <Text className="text-lg font-bold text-primary-content">
              Registrar o Ponto
            </Text>
          </TouchableOpacity>
        </Link>
      </View>
    </SafeAreaView>
  );
}
