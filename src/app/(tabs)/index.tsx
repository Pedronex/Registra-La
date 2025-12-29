import { Header } from '@/components/Header'
import { History } from '@/components/History'
import { useConfig } from '@/hooks/useConfig'
import { useRegister } from '@/hooks/useRegister'
import { useTheme } from '@/providers/ThemeProvider'
import { colors } from '@/utils/colorThemes'
import { useState } from 'react'
import { ActivityIndicator, Text, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

/**
 * Página principal do aplicativo após login
 * Exibe o histórico de ponto e opções para configurar e registrar.
 */
export default function HomePage() {
  const { loading: loadingConfig } = useConfig()
  const { loading: loadingRegister } = useRegister()
  const { theme } = useTheme()

  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  if (loadingConfig || loadingRegister) {
    return (
      <View className="flex-1 justify-center items-center bg-background">
        <Text>Carregando...</Text>
      </View>
    )
  }

  if (loadingRegister) {
    return (
      <View className="flex-1 justify-center items-center p-6 bg-background">
        <ActivityIndicator size="large" className="mb-3" color={colors[theme].backgroundColor} />
        <Text className="text-lg font-medium text-background-content">
          Processando dados da foto...
        </Text>
      </View>
    )
  }

  return (
    <SafeAreaView className="flex-1 bg-background p-4 gap-4">
      <Header title="Página Inicial" />

      <History date={selectedDate ?? undefined} onDateChange={setSelectedDate} />
    </SafeAreaView>
  )
}
