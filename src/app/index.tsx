import { Link } from "expo-router";
import { Text, View } from "react-native";

import { Header } from "@/components/Header";
import { useConfig } from "@/hooks/useConfig";
import { SafeAreaView } from "react-native-safe-area-context";

/**
 * Página inicial do aplicativo
 * Apresenta o aplicativo e fornece acesso à configuração
 */
export default function InitialPage() {
  const { config } = useConfig();

  /**
   * Renderiza o cabeçalho da página
   */
  const renderHeader = () => <Header />;

  /**
   * Renderiza o slogan do aplicativo
   */
  const renderSlogan = () => (
    <View>
      <Text
        className="text-3xl text-background-content text-start"
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
      className="p-2 mt-5 w-full rounded-3xl bg-primary"
      accessibilityRole="button"
      accessibilityLabel="Entrar no aplicativo"
    >
      <Text className="text-3xl font-bold text-center text-primary-content">
        Entrar
      </Text>
    </Link>
  );

  return (
    <SafeAreaView
      className={`justify-between items-center p-10 w-screen h-screen bg-background`}
    >
      {renderHeader()}
      {renderSlogan()}
      {renderEnterButton()}
    </SafeAreaView>
  );
}
