import { Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Header } from "@/components/Header";

export default function CalendarPage() {
  return (
    <SafeAreaView className="flex-1 bg-background">
      <Header title="Calendário" />
      <View className="flex-1 justify-center items-center">
        <Text className="text-background-content">Calendário</Text>
      </View>
    </SafeAreaView>
  );
}
