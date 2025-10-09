import { useTheme } from '@/providers/ThemeProvider'
import { colors } from '@/utils/colorThemes'
import { Entypo } from '@expo/vector-icons'
import { Text, TouchableOpacity, View } from 'react-native'

interface DayCellProps {
  day: Date | null
  balance?: number
  isWorked?: boolean
  onPress: (day: Date) => void
}

function formatBalance(balance: number) {
  if (isNaN(balance)) return '+00:00'

  // Log para debug
  console.log(`[DayCell] Original balance: ${balance}h`)

  // Aplica tolerância de 10 minutos
  const toleranceMinutes = 10
  // Converte para minutos para evitar problemas de precisão de ponto flutuante
  const balanceMinutes = Math.round(balance * 60)

  if (Math.abs(balanceMinutes) <= toleranceMinutes) {
    console.log(`[DayCell] Applied tolerance: ${balance}h (${balanceMinutes}min) -> 00:00`)
    return '00:00'
  }

  const hours = Math.floor(Math.abs(balance))
  const minutes = Math.round((Math.abs(balance) % 1) * 60)
  const sign = balance < 0 ? '-' : '+'
  const result = `${sign}${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`
  console.log(`[DayCell] Final format: ${balance}h -> ${result}`)
  return result
}

export function DayCell({ day, balance, isWorked, onPress }: DayCellProps) {
  const { theme } = useTheme()

  if (!day) {
    return <View className="w-12 h-16" />
  }

  const today = new Date()
  const isToday =
    day.getDate() === today.getDate() &&
    day.getMonth() === today.getMonth() &&
    day.getFullYear() === today.getFullYear()

  const cellStyle = isToday
    ? 'bg-primary'
    : balance !== undefined && balance < 0
      ? 'bg-error'
      : 'bg-secondary'
  const textStyle = isToday
    ? 'text-primary-content'
    : balance !== undefined && balance < 0
      ? 'text-error-content'
      : 'text-secondary-content'

  return (
    <TouchableOpacity onPress={() => onPress(day)}>
      <View className={`w-12 h-16 items-center justify-center rounded-lg ${cellStyle}`}>
        <Text className={`font-bold ${textStyle}`}>{day.getDate()}</Text>
        {balance !== undefined && (
          <Text className={`text-xs ${textStyle}`}>{formatBalance(balance)}</Text>
        )}
        {isWorked && (
          <Entypo
            name="check"
            size={16}
            color={isToday ? colors[theme].secondary : colors[theme].primary}
          />
        )}
      </View>
    </TouchableOpacity>
  )
}
