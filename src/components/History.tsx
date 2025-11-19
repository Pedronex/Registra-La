import { RegisterData } from '@/db/schema'
import { useConfig } from '@/hooks/useConfig'
import { useTimeRecords } from '@/hooks/useTimeRecords'
import { useTheme } from '@/providers/ThemeProvider'
import { colors } from '@/utils/colorThemes'
import { convertMinutesToTime, convertSecondsToTime } from '@/utils/convert'
import { Entypo, MaterialIcons } from '@expo/vector-icons'
import { DateTimePickerAndroid } from '@react-native-community/datetimepicker'
import { addDays, format, isToday, subDays } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { router } from 'expo-router'
import { useEffect, useMemo, useState } from 'react'
import { ActivityIndicator, Text, TouchableOpacity, View } from 'react-native'

/**
 * Componente que exibe o histórico de registros de ponto
 */
type HistoryProps = {
  date?: Date
  onDateChange?: (date: Date) => void
}

export function History({ date: controlledDate, onDateChange }: HistoryProps = {}) {
  // Estados
  const [internalDate, setInternalDate] = useState(new Date())
  const date = controlledDate ?? internalDate
  const setDate = onDateChange ?? setInternalDate

  // Hooks
  const { records, loading } = useTimeRecords(format(date, 'dd/MM/yyyy'))
  const { config } = useConfig()
  const { theme } = useTheme()
  const [currentTimeInSeconds, setCurrentTimeInSeconds] = useState(
    new Date().getHours() * 3600 + new Date().getMinutes() * 60 + new Date().getSeconds(),
  )
  // Efeito para atualizar a data para o dia atual se não for controlado

  useEffect(() => {
    if (!controlledDate) {
      setDate(new Date())
    }
  }, [controlledDate, setDate])

  const isClockedIn = useMemo(() => {
    if (!isToday(date)) {
      return false
    }
    const workRecords = records.filter((r) => r.type === 'trabalho')
    return workRecords.length % 2 !== 0
  }, [records, date])

  useEffect(() => {
    let timer: NodeJS.Timeout | null = null

    if (isClockedIn) {
      timer = setInterval(() => {
        setCurrentTimeInSeconds(
          new Date().getHours() * 3600 + new Date().getMinutes() * 60 + new Date().getSeconds(),
        )
      }, 1000)
    }

    return () => {
      if (timer) {
        clearInterval(timer)
      }
    }
  }, [isClockedIn])

  /**
   * Calcula o total de horas trabalhadas
   */
  const totalHoursWorked = useMemo(() => {
    const workRecords = records
      .filter((r) => r.type === 'trabalho')
      .sort((a, b) => a.timeInMinutes - b.timeInMinutes)

    let totalInSeconds = 0
    for (let i = 0; i < workRecords.length; i += 2) {
      if (workRecords[i + 1]) {
        totalInSeconds += workRecords[i + 1].timeInMinutes * 60 - workRecords[i].timeInMinutes * 60
      }
    }

    if (isClockedIn) {
      const lastEntry = workRecords[workRecords.length - 1]
      if (lastEntry) {
        totalInSeconds += currentTimeInSeconds - lastEntry.timeInMinutes * 60
      }
    }
    if (totalInSeconds <= 0) return '00:00'

    return convertSecondsToTime(totalInSeconds)
  }, [records, isClockedIn, currentTimeInSeconds])

  /**
   * Calcula o saldo de horas do dia
   */
  const hourBalance = useMemo(() => {
    const workRecords = records
      .filter((r) => r.type === 'trabalho')
      .sort((a, b) => a.timeInMinutes - b.timeInMinutes)
    if (!config?.workHours || workRecords.length < 2) {
      // Mesmo sem pares de trabalho suficientes, ainda podemos ter abono que zere o saldo
      if (!config?.workHours) return '00:00'
      const targetSeconds = (config.workHours || 0) * 3600
      let abonoSeconds = 0
      const abonos = records.filter((r) => r.type !== 'trabalho')
      for (const a of abonos) {
        if (a.isFullDay) {
          abonoSeconds += (config.workHours || 0) * 3600
        } else if (a.timeInMinutes) {
          abonoSeconds += a.timeInMinutes * 60
        }
      }
      const diffSeconds = abonoSeconds - targetSeconds
      const toleranceSeconds = (config.tolerance || 10) * 60
      if (Math.abs(diffSeconds) <= toleranceSeconds) {
        return '00:00'
      }
      const totalSeconds = diffSeconds
      const minutes = totalSeconds / 60
      return convertMinutesToTime(minutes)
    }

    const targetSeconds = config.workHours * 3600

    let totalInSeconds = 0
    for (let i = 0; i < workRecords.length; i += 2) {
      if (workRecords[i + 1]) {
        totalInSeconds += workRecords[i + 1].timeInMinutes * 60 - workRecords[i].timeInMinutes * 60
      }
    }

    if (isClockedIn) {
      const lastEntry = workRecords[workRecords.length - 1]
      if (lastEntry) {
        totalInSeconds += currentTimeInSeconds - lastEntry.timeInMinutes * 60
      }
    }

    // Soma de abonos (folga/atestado)
    let abonoSeconds = 0
    const abonos = records.filter((r) => r.type !== 'trabalho')
    for (const a of abonos) {
      if (a.isFullDay) {
        abonoSeconds += (config.workHours || 0) * 3600
      } else if (a.timeInMinutes) {
        abonoSeconds += a.timeInMinutes * 60
      }
    }

    const diffSeconds = totalInSeconds + abonoSeconds - targetSeconds
    const toleranceSeconds = (config.tolerance || 10) * 60

    if (Math.abs(diffSeconds) <= toleranceSeconds) {
      return '00:00'
    }
    const totalSeconds = Math.abs(diffSeconds)
    return convertSecondsToTime(totalSeconds)
  }, [records, config, isClockedIn, currentTimeInSeconds])

  /**
   * Renderiza o cabeçalho com a data e os botões de navegação
   */
  const renderHeader = () => (
    <View className="flex-row justify-between items-center p-4 mb-4 rounded-lg shadow-lg bg-primary">
      <TouchableOpacity
        onPress={() => setDate(subDays(date, 1))}
        className="p-3 rounded-full bg-primary-focus"
      >
        <Entypo name="chevron-left" size={24} color={colors[theme].primaryContent} />
      </TouchableOpacity>
      <TouchableOpacity
        className="items-center"
        onPress={() => {
          DateTimePickerAndroid.open({
            value: date,
            mode: 'date',
            onChange: (event, selectedDate) => {
              if (event.type === 'set' && selectedDate) {
                setDate(selectedDate)
              }
            },
          })
        }}
      >
        <Text className="text-2xl font-bold text-primary-content">
          {format(date, "dd 'de' MMMM", { locale: ptBR })}
        </Text>
        <Text className="text-sm opacity-80 text-primary-content">
          {format(date, 'yyyy', { locale: ptBR })}
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => setDate(addDays(date, 1))}
        className="p-3 rounded-full bg-primary-focus"
      >
        <Entypo name="chevron-right" size={24} color={colors[theme].primaryContent} />
      </TouchableOpacity>
    </View>
  )

  /**
   */
  const displayItems = useMemo(() => {
    type HistoryItem =
      | { type: 'record'; data: RegisterData; isEntry: boolean }
      | { type: 'break'; data: { formatted: string } }

    const items: HistoryItem[] = []

    const workRecords = records
      .filter((r) => r.type === 'trabalho')
      .sort((a, b) => a.timeInMinutes - b.timeInMinutes)

    const nonWorkRecords = records
      .filter((r) => r.type !== 'trabalho')
      .sort((a, b) => a.timeInMinutes - b.timeInMinutes)

    // Adiciona registros de trabalho com intervalos
    for (let i = 0; i < workRecords.length; i++) {
      const record = workRecords[i]
      const isEntry = i % 2 === 0

      // ponto atual (Entrada ou Saída)
      items.push({ type: 'record', data: record, isEntry })

      // VERIFICAÇÃO DO INTERVALO:
      if (!isEntry && workRecords[i + 1]) {
        const breakMinutes = workRecords[i + 1].timeInMinutes - record.timeInMinutes

        const hours = Math.floor(breakMinutes / 60)
        const minutes = breakMinutes % 60

        if (hours > 0 || minutes > 0) {
          items.push({ type: 'break', data: { formatted: `${hours}h ${minutes}m intervalo` } })
        }
      }
    }

    // Adiciona registros de folga e atestado
    for (const record of nonWorkRecords) {
      items.push({ type: 'record', data: record, isEntry: false })
    }

    // Ordena todos os itens por horário (considerando registros sem horário)
    items.sort((a, b) => {
      if (a.type === 'record' && b.type === 'record') {
        // Se algum dos registros não tem horário (dia completo), coloca no final
        if (!a.data.timeInMinutes && !b.data.timeInMinutes) return 0
        if (!a.data.timeInMinutes) return 1
        if (!b.data.timeInMinutes) return -1
        return a.data.timeInMinutes - b.data.timeInMinutes
      }
      return 0
    })

    return items
  }, [records])

  /**
   * Renderiza a lista de registros e intervalos
   */
  const renderHistoryItems = () => (
    <View className="flex-1 justify-between p-4 rounded-lg bg-secondary">
      {displayItems.map((item, index) => {
        if (item.type === 'record') {
          return (
            <TouchableOpacity
              key={`record-${item.data.id}`}
              className="flex-row items-center p-3 mb-4 rounded-lg bg-secondary-focus active:opacity-80 justify-between"
              onPress={() => router.push(`/${item.data.id}`)}
            >
              <View className="justify-center items-center w-12 h-12 rounded-full">
                {item.data.type === 'trabalho' ? (
                  <MaterialIcons
                    name={item.isEntry ? 'login' : 'logout'}
                    size={24}
                    color={colors[theme].secondaryContent}
                  />
                ) : item.data.type === 'folga' ? (
                  <MaterialIcons
                    name="beach-access"
                    size={24}
                    color={colors[theme].secondaryContent}
                  />
                ) : (
                  <MaterialIcons
                    name="medical-services"
                    size={24}
                    color={colors[theme].secondaryContent}
                  />
                )}
              </View>
              <View className="flex-1 ml-4">
                <Text className="text-xl font-bold text-secondary-content">
                  {item.data.type === 'trabalho'
                    ? convertMinutesToTime(item.data.timeInMinutes)
                    : item.data.isFullDay
                      ? 'Dia completo'
                      : item.data.timeInMinutes || '0:00'}
                </Text>
                <Text className="text-sm opacity-80 text-secondary-content">
                  {item.data.type === 'trabalho'
                    ? item.data.description || (item.isEntry ? 'Entrada' : 'Saída')
                    : item.data.type === 'folga'
                      ? item.data.isFullDay
                        ? 'Folga - dia todo'
                        : `Folga - ${convertMinutesToTime(item.data.timeInMinutes || 0)} horas`
                      : item.data.isFullDay
                        ? 'Atestado - dia todo'
                        : `Atestado - ${convertMinutesToTime(item.data.timeInMinutes || 0)} horas`}
                </Text>
                {item.data.location && item.data.type !== 'trabalho' && (
                  <Text className="text-xs opacity-60 text-secondary-content mt-1">
                    {item.data.location}
                  </Text>
                )}
                {item.data.nsr && (
                  <Text className="text-xs opacity-60 text-secondary-content mt-1">
                    NSR: {item.data.nsr}
                  </Text>
                )}
              </View>
              <MaterialIcons
                name="edit"
                size={20}
                color={colors[theme].secondaryContent}
                style={{ opacity: 0.6 }}
              />
            </TouchableOpacity>
          )
        } else if (item.type === 'break') {
          return (
            <View key={`break-${index}`} className="flex-row justify-center items-center my-2">
              <View className="flex-1 h-[1px] bg-secondary-content opacity-20" />
              <Text className="mx-4 text-sm text-secondary-content">{item.data.formatted}</Text>
              <View className="flex-1 h-[1px] bg-secondary-content opacity-20" />
            </View>
          )
        }
        return null
      })}
    </View>
  )

  return (
    <View className="flex-1 w-full rounded-lg shadow-lg">
      {renderHeader()}
      {loading ? (
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" color={colors[theme].secondaryContent} />
        </View>
      ) : (
        renderHistoryItems()
      )}
      <View className="p-4 mt-4 rounded-lg shadow-md bg-tertiary">
        <View className="flex-row justify-between items-center">
          <Text className="text-lg text-tertiary-content">Total trabalhado:</Text>
          <Text className="text-2xl font-bold text-tertiary-content">{totalHoursWorked}</Text>
        </View>
        <View className="flex-row justify-between items-center">
          <Text
            className={`text-lg ${hourBalance.includes('-') ? 'text-red-500' : 'text-green-500'}`}
          >
            Banco de Horas:
          </Text>
          <Text
            className={`text-lg font-bold ${
              hourBalance.includes('-') ? 'text-red-500' : 'text-green-500'
            }`}
          >
            {hourBalance}
          </Text>
        </View>
      </View>
    </View>
  )
}
