import { useTheme } from '@/providers/ThemeProvider'
import { colors } from '@/utils/colorThemes'
import { Entypo, FontAwesome } from '@expo/vector-icons'
import { Tabs } from 'expo-router'

export default function TabsLayout() {
  const { theme } = useTheme()

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveBackgroundColor: colors[theme].primaryContent,
        tabBarStyle: {
          backgroundColor: colors[theme].background,
        },
        tabBarHideOnKeyboard: true,
        tabBarActiveTintColor: colors[theme].primary,
        tabBarInactiveTintColor: colors[theme].surfaceContent,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Registros',
          tabBarIcon: ({ color, size }) => <Entypo name="list" size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="add"
        options={{
          title: 'Adicionar',
          tabBarIcon: ({ color, size }) => <Entypo name="plus" size={size} color={color} />,
          popToTopOnBlur: true,
        }}
      />
      <Tabs.Screen
        name="calendar"
        options={{
          title: 'Calendário',
          tabBarIcon: ({ color, size }) => (
            <FontAwesome name="calendar" size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  )
}
