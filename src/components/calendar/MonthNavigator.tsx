import { useTheme } from "@/providers/ThemeProvider";
import { colors } from "@/utils/colorThemes";
import { Entypo } from "@expo/vector-icons";
import { Text, TouchableOpacity, View } from "react-native";

interface MonthNavigatorProps {
  date: Date;
  onChangeMonth: (amount: number) => void;
}

export function MonthNavigator({ date, onChangeMonth }: MonthNavigatorProps) {
  const { theme } = useTheme();

  return (
    <View className="flex-row justify-between items-center mb-4">
      <TouchableOpacity onPress={() => onChangeMonth(-1)}>
        <Entypo name="chevron-left" size={30} color={colors[theme].primary} />
      </TouchableOpacity>
      <Text className="text-xl text-primary-content">{`${
        date.toLocaleString("default", { month: "long" })
      } ${date.getFullYear()}`}</Text>
      <TouchableOpacity onPress={() => onChangeMonth(1)}>
        <Entypo name="chevron-right" size={30} color={colors[theme].primary} />
      </TouchableOpacity>
    </View>
  );
}
