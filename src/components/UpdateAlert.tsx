import { useUpdate } from '@/hooks/useUpdate'

import { Text, TouchableOpacity, View } from 'react-native'

export function UpdateAlert() {
  const { updateApp } = useUpdate()

  return (
    <View className="flex-row justify-between items-center px-4 py-2 w-screen bg-success">
      <Text className="font-medium text-success-content">Atualização disponível</Text>
      <TouchableOpacity
        className="px-4 py-1 rounded-lg bg-success-content"
        onPress={async () => {
          try {
            await updateApp()
          } catch (error) {
            console.error('Erro ao atualizar:', error)
          }
        }}
        accessibilityRole="button"
        accessibilityLabel="Recarregar aplicativo"
      >
        <Text className="font-medium text-success">Recarregar</Text>
      </TouchableOpacity>
    </View>
  )
}
