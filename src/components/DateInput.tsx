import DateTimePicker from '@react-native-community/datetimepicker'
import { format, isToday, isYesterday } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { useState } from 'react'
import { Text, TouchableOpacity, View } from 'react-native'

interface Props {
  mode: 'date' | 'time'
  onChange: (text: Date) => void
  value: Date
}

function formatFriendlyDate(date: Date) {
  if (isToday(date)) return `Hoje, ${format(date, 'dd/MM/yyyy')}`
  if (isYesterday(date)) return `Ontem, ${format(date, 'dd/MM/yyyy')}`
  const label = format(date, 'EEEE, dd/MM/yyyy', { locale: ptBR })
  return label.charAt(0).toUpperCase() + label.slice(1)
}

export function DateInput({ mode, onChange, value }: Props) {
  const [showDatePicker, setShowDatePicker] = useState(false)

  return (
    <View>
      <TouchableOpacity
        onPress={() => setShowDatePicker(true)}
        accessibilityRole="button"
        accessibilityLabel={mode === 'date' ? 'Selecionar data' : 'Selecionar hora'}
        className="justify-center px-4 h-12 rounded-xl bg-surface"
      >
        <Text className="text-surface-content">
          {mode === 'date'
            ? formatFriendlyDate(value)
            : value.toLocaleTimeString('pt-BR', {
                hour: '2-digit',
                minute: '2-digit',
              })}
        </Text>
      </TouchableOpacity>
      {showDatePicker && (
        <DateTimePicker
          value={value}
          mode={mode}
          is24Hour={true}
          onChange={(event, date) => {
            if (date) {
              onChange(date)
            }
            setShowDatePicker(false)
          }}
        />
      )}
    </View>
  )
}
