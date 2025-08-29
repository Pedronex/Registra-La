import { useTheme } from "@/providers/ThemeProvider";
import { colors } from "@/utils/colorThemes";
import { Entypo } from "@expo/vector-icons";
import { Link } from "expo-router";
import { Image, Text, TouchableOpacity, View } from "react-native";

/**
 * Interface de propriedades do componente Header
 */
interface HeaderProps {
  /**
   * Título opcional para o cabeçalho
   */
  title?: string;
  /**
   *
   */
  showConfig?: boolean;
}

/**
 * Componente de cabeçalho do aplicativo
 * Exibe o logo e o título do aplicativo
 */
export function Header({
  title = "Registra lá",
  showConfig = true,
}: HeaderProps) {
  const logoDark = require("@/assets/Relogio.png");

  const { theme } = useTheme();

  return (
    <View
      className={`flex-row ${
        showConfig ? "justify-between" : "justify-center"
      } items-center px-4 w-screen`}
    >
      <View
        className={`p-2 w-14 h-14 rounded-2xl mr-2 ${
          theme === "dark" ? "" : "bg-primary"
        }`}
      >
        <Image
          source={logoDark}
          width={50}
          height={50}
          className="mr-2 w-full h-full"
          accessibilityLabel="Logo do aplicativo"
        />
      </View>
      <Text
        className="text-4xl text-surface-content"
        accessibilityRole="header"
      >
        {title}
      </Text>
      {showConfig && (
        <Link href="/config" asChild>
          <TouchableOpacity
            className="rounded-lg"
            accessibilityRole="button"
            accessibilityLabel="Configurar aplicativo"
          >
            <Entypo name="cog" size={35} color={colors[theme].primary} />
          </TouchableOpacity>
        </Link>
      )}
    </View>
  );
}
