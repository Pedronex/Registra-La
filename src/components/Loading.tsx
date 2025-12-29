import { useTheme } from "@/providers/ThemeProvider";
import { colors } from "@/utils/colorThemes";
import { ActivityIndicator, Text, View } from "react-native";

export function Loading() {
    const { theme } = useTheme()

  return (
    <View className="p-6 items-center">
      <ActivityIndicator size="large" color={colors[theme].secondaryContent} />
      <Text className="text-secondary-content mt-2">Adicionando novo ponto</Text>
    </View>
  )
}