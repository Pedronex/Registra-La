import { Image, Text, View } from "react-native";
import { useThemeColor } from "@/hooks/useThemeColor";

/**
 * Interface de propriedades do componente Header
 */
interface HeaderProps {
  /**
   * Título opcional para o cabeçalho
   */
  title?: string;
}

/**
 * Componente de cabeçalho do aplicativo
 * Exibe o logo e o título do aplicativo
 */
export function Header({ title = "Registra lá" }: HeaderProps) {
  const textColor = useThemeColor({ light: "#000000", dark: "#FFFFFF" }, "text");
  
  return (
    <View className="flex-row justify-center items-center">
      <Image 
        source={require("@/assets/Relogio.png")} 
        width={50} 
        height={50} 
        className="mr-2"
        accessibilityLabel="Logo do aplicativo"
      />
      <Text 
        className="text-4xl dark:text-white"
        style={{ color: textColor }}
        accessibilityRole="header"
      >
        {title}
      </Text>
    </View>
  );
}