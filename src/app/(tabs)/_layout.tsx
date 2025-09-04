import { Tabs } from "expo-router";
import { Entypo, FontAwesome } from "@expo/vector-icons";
import { useTheme } from "@/providers/ThemeProvider";
import { colors } from "@/utils/colorThemes";

export default function TabsLayout() {
  const { theme } = useTheme();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: colors[theme].background,
        },
        tabBarActiveTintColor: colors[theme].primary,
        tabBarInactiveTintColor: colors[theme].surfaceContent,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Registros",
          tabBarIcon: ({ color, size }) => (
            <Entypo name="list" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="add"
        options={{
          title: "Adicionar",
          tabBarIcon: ({ color, size }) => (
            <Entypo name="plus" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="calendar"
        options={{
          title: "Calendário",
          tabBarIcon: ({ color, size }) => (
            <FontAwesome name="calendar" size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
