import { useTheme } from '@/providers/ThemeProvider'
import { colors } from '@/utils/colorThemes'
import { convertMinutesToTime } from '@/utils/convert'
import { Entypo } from '@expo/vector-icons'
import { Text, TouchableOpacity, View } from 'react-native'

interface DayCellProps {
  day: Date | null
  balance?: number
  isWorked?: boolean
  isWorkDay?: boolean
  onPress: (day: Date) => void
}

export function DayCell({ day, balance, isWorked, isWorkDay, onPress }: DayCellProps) {
  const { theme } = useTheme()

  if (!day) {
    return <View className="w-12 h-16" />
  }

  const today = new Date()
  const isToday =
    day.getDate() === today.getDate() &&
    day.getMonth() === today.getMonth() &&
    day.getFullYear() === today.getFullYear()

  function cellStyle() {
    if(balance !== undefined) {
      if(balance < 0) {
        return 'bg-error'
      }else {
        return 'bg-success'
      }
    } else {
      if(isToday) {
        return 'bg-primary'
      } else {
        return 'bg-secondary'
      }
    }
  }
  function textStyle() {
    if(balance !== undefined) {
      if(balance < 0) {
        return 'text-error-content'
      }else {
        return 'text-success-content'
      }
    } else {
      if(isToday) {
        return 'text-primary-content'
      } else {
        return 'text-secondary-content'
      }
    }
  }

  function getWorkDayStatus() {
    if (isWorked) {
      return 'check'
    }
    if(isWorkDay) {
      return 'clock'
    }
    return 'minus'
  }

  function getWorkDayColor() {
    if(balance !== undefined) {
      if(balance < 0) {
        return colors[theme].errorContent
      }else {
        return colors[theme].successContent
      }
    } else {
      if(isToday) {
        return colors[theme].primaryContent
      } else {
        return colors[theme].secondaryContent
      }
    }
  }

  return (
    <TouchableOpacity onPress={() => onPress(day)}>
      <View className={`w-12 h-16 items-center justify-center rounded-lg ${cellStyle()}`}>
        <Text className={`font-bold ${textStyle()}`}>{day.getDate()}</Text>
        {balance !== undefined && (
          <Text className={`text-xs ${textStyle()}`}>{convertMinutesToTime(balance)}</Text>
        )}
        <Entypo
          name={getWorkDayStatus()}
          size={16}
          color={getWorkDayColor()}
        />
      </View>
    </TouchableOpacity>
  )
}
