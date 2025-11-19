import { Header } from '@/components/Header'
import { History } from '@/components/History'
import { useConfig } from '@/hooks/useConfig'
import { useRegister } from '@/hooks/useRegister'
import { useTheme } from '@/providers/ThemeProvider'
import { colors } from '@/utils/colorThemes'
import { convertTimeToMinutes } from '@/utils/convert'
import { Entypo } from '@expo/vector-icons'
import * as ImagePicker from 'expo-image-picker'
import { Link } from 'expo-router'
import { useState } from 'react'
import { ActivityIndicator, Text, TouchableOpacity, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

/**
 * Página principal do aplicativo após login
 * Exibe o histórico de ponto e opções para configurar e registrar.
 */
export default function HomePage() {
  const { loading: loadingConfig } = useConfig()
  const { saveRegister, extractDataPhoto, loading: loadingRegister } = useRegister()
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

      console.log(save)
      const newDate = new Date(`${date.split('/').reverse().join('-')}T${time}:00`)
      setSelectedDate(newDate)
    }
    return
  }

  return (
    <SafeAreaView className="flex-1 bg-background">
      <Header title="Página Inicial" />

      <View className="flex-1 p-4">
        <History date={selectedDate ?? undefined} onDateChange={setSelectedDate} />
      </View>

      <View className="m-4 flex-row gap-2">
        <Link
          href={{
            pathname: '/add',
            params: selectedDate ? { date: selectedDate.toLocaleDateString('pt-BR') } : {},
          }}
          asChild
        >
          <TouchableOpacity className="flex-row gap-x-4 justify-center items-center p-2 w-1/2 rounded-lg bg-primary">
            <Entypo name="clock" size={24} color="white" />
            <Text className="text-lg font-bold text-primary-content">Registro Manual</Text>
          </TouchableOpacity>
        </Link>

        <TouchableOpacity
          onPress={handleAutoSavePhoto}
          className="flex-row gap-x-4 justify-center items-center p-4 w-1/2 rounded-lg bg-primary"
        >
          <Entypo name="clock" size={24} color="white" />
          <Text className="text-lg font-bold text-primary-content">Registrar Auto</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  )
}
