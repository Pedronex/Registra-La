import { RegisterData } from '@/db/schema/registers'
import { useConfig } from '@/hooks/useConfig'
import { useRegister } from '@/hooks/useRegister'
import { useTimeRecords } from '@/hooks/useTimeRecords'
import { useTheme } from '@/providers/ThemeProvider'
import { colors } from '@/utils/colorThemes'
import { convertTimeToMinutes } from '@/utils/convert'
import { Entypo, Octicons } from '@expo/vector-icons'
import { DateTimePickerAndroid } from '@react-native-community/datetimepicker'
import { addDays, format, subDays } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import * as ImagePicker from 'expo-image-picker'
import { LinearGradient } from 'expo-linear-gradient'
import { Link } from 'expo-router'
import { useEffect, useMemo, useState } from 'react'
import { ActivityIndicator, ScrollView, Text, TouchableOpacity, View } from 'react-native'
import { Balance } from './Balance'
import { Loading } from './Loading'
import { Record } from './Record'

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
  const { records, loading, loadRecords } = useTimeRecords(format(date, 'dd/MM/yyyy'))
  const { config } = useConfig()
  const { theme } = useTheme()
  const { saveRegister, extractDataPhoto, loading: registerLoading } = useRegister()

  // Efeito para atualizar a data para o dia atual se não for controlado
  useEffect(() => {
    if (!controlledDate) {
      setDate(new Date())
    }
  }, [controlledDate, setDate])

  const handleAutoSavePhoto = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync()
    if (status !== 'granted') {
      alert('Permissão de câmera negada!')
      return
    }

    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: 'images',
      allowsEditing: false,
      aspect: [4, 3],
      quality: 0.5,
    })

    if (!result.canceled || result.assets) {
      const formData = new FormData()
      const file = {
        uri: result.assets[0].uri, // A URI do arquivo (caminho local)
        name: result.assets[0].fileName || result.assets[0].uri.split('/').pop(), // Nome do arquivo. Use o nome retornado ou extraia da URI
        type: 'image/jpeg', // O tipo MIME. O ImagePicker não retorna o tipo MIME no iOS/Android/Web de forma confiável, então defina-o
      }
      formData.append('file', file as any as File)

      const { date, time, nsr } = await extractDataPhoto(formData)
      const save = await saveRegister({
        date,
        createdAt: new Date(),
        updatedAt: new Date(),
        timeInMinutes: convertTimeToMinutes(time),
        nsr,
        type: 'trabalho',
        location: '',
        photo: result.assets[0].uri,
        isFullDay: false,
      })
      const newDate = new Date(`${date.split('/').reverse().join('-')}T${time}:00`)
      if (save) {
        setDate(newDate)
        loadRecords()
      }
    }
    return;
  }

  /**
   * Renderiza o cabeçalho com a data e os botões de navegação
   */
  const renderHeader = () => (
    <View className="mb-4">
      <View className="flex-row justify-between items-center p-4 rounded-lg bg-secondary border border-primary mb-2">
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

      <View className='flex-row justify-between gap-4'>
        <Link
          className="bg-primary p-3 rounded-lg items-center justify-center flex-row"
          href="/add"
        >
          <Entypo name="plus" size={20} color={colors[theme].primaryContent} style={{ marginRight: 8 }} />
          <Text className="text-primary-content font-bold">Registro Manual</Text>
        </Link>
        <TouchableOpacity
          onPress={handleAutoSavePhoto}
          className="bg-primary p-3 rounded-lg items-center justify-center flex-row"
        >
          <Octicons name="sparkles-fill" size={20} color={colors[theme].primaryContent} style={{ marginRight: 8 }} />
          <Text className="text-primary-content font-bold">Registro Automático</Text>
        </TouchableOpacity>
      </View>
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
  const renderHistoryItems = () => {
    if (records.length === 0) {
      const workDays = config?.workDays
      if (workDays && Array.isArray(workDays) && !workDays.includes(controlledDate?.getDay())) {
        return (
          <View className="flex-1 justify-center items-center">
            <Text className="text-lg text-secondary-content">Você não trabalha neste dia</Text>
          </View>
        )
      }
    }

    return (
      <LinearGradient
        colors={[colors[theme].secondary, colors[theme].surface]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={{
          justifyContent: 'space-between',
          borderRadius: 8,
        }}
      >
        {registerLoading ? (
          <Loading />
        ) : (
          <>
            {displayItems.map((item, index) => {
              if (item.type === 'record') {
                return (
                  <Record key={`record-${item.data.id}`} data={item.data} isEntry={item.isEntry} />
                )
              } else if (item.type === 'break') {
                return (
                  <View key={`break-${index}`} className="flex-row justify-center items-center my-2">
                    <LinearGradient
                      colors={['transparent', colors[theme].secondaryContent, 'transparent']}
                      start={{ x: 0, y: 0.5 }}
                      end={{ x: 1, y: 0.5 }}
                      style={{ flex: 1, height: 1, opacity: 0.2 }}
                    />
                    <Text className="mx-4 text-sm bg-secondary-content text-secondary px-2 py-1 rounded-full">
                      {item.data.formatted}
                    </Text>
                    <LinearGradient
                      colors={['transparent', colors[theme].secondaryContent, 'transparent']}
                      start={{ x: 0, y: 0.5 }}
                      end={{ x: 1, y: 0.5 }}
                      style={{ flex: 1, height: 1, opacity: 0.2 }}
                    />
                  </View>
                )
              }
              return null
            })}
          </>
        )}
      </LinearGradient>
    )
  }

  if (loading) {
    return <View className="flex-1 w-full rounded-lg h-fit">
      <View className="flex-1 justify-center items-center">
        <ActivityIndicator size="large" color={colors[theme].secondaryContent} />
      </View>
    </View>
  }

  return (
    <View className="flex-1 w-full rounded-lg h-fit justify-between">
      {renderHeader()}
      <View className='flex-1'>
        <ScrollView>
          {renderHistoryItems()}
        </ScrollView>
      </View>
      <Balance date={controlledDate || new Date()} records={records} />
    </View>
  )
}
