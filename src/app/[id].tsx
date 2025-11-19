import * as ImagePicker from 'expo-image-picker'
import { router, useLocalSearchParams } from 'expo-router'
import { useEffect, useState } from 'react'
import { ActivityIndicator, Image, Text, TextInput, TouchableOpacity, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

import { DateInput } from '@/components/DateInput'
import { Header } from '@/components/Header'
import { HourInput } from '@/components/HourInput'
import { RegisterInsert } from '@/db/schema'
import { useConfig } from '@/hooks/useConfig'
import { useRegister } from '@/hooks/useRegister'
import { useTheme } from '@/providers/ThemeProvider'
import { colors } from '@/utils/colorThemes'
import { convertMinutesToTime, convertTimeToMinutes } from '@/utils/convert'
import { Entypo } from '@expo/vector-icons'

/**
 * Página de registro de ponto
 * Permite o usuário registrar o seu ponto
 */
export default function RegisterEdit() {
  const { id } = useLocalSearchParams()

  const [register, setRegister] = useState<RegisterInsert>({
    date: new Date().toLocaleDateString('pt-BR'),
    timeInMinutes: new Date().getHours() * 60 + new Date().getMinutes(),
    type: 'trabalho',
    nsr: '',
    location: '',
    photo: '',
    isFullDay: false,
    createdAt: new Date(),
    updatedAt: new Date(),
  })

  const { config } = useConfig()
  const { editRegister, findById, deleteRegister, extractDataPhoto, loading } = useRegister()
  const { theme } = useTheme()

  useEffect(() => {
    async function fetchData() {
      const data = await findById(Number(id))
      console.log(data)
      setRegister(data)
    }

    if (!Array.isArray(id)) {
      fetchData()
    }
  }, [findById, id])

  const handleTakePhoto = async () => {
    if (!config) {
      return
    }
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

      setRegister({
        ...register,
        photo: result.assets[0].uri,
      })
      if (register.type === 'trabalho') {
        const { date, time, nsr } = await extractDataPhoto(formData)

        setRegister((prev) => ({
          ...prev,
          date,
          timeInMinutes: convertTimeToMinutes(time),
          nsr,
        }))
      }
    }
    return
  }

  const handleInputChange = (
    field: keyof RegisterInsert,
    value: string | Date | boolean | number,
  ) => {
    setRegister((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  async function handleUpdateRegister() {
    try {
      const result = await editRegister(Number(id), register)
      if (result) {
        alert('Registro atualizado com sucesso!')
        router.back()
        return
      }
      console.error(register)
      alert('Não foi possível atualizar o registro!')
      return
    } catch (error) {
      console.error(error)
      alert('Erro ao atualizar registro!')
    }
  }

  async function handleDeleteRegister() {
    const result = await deleteRegister(Number(id))
    if (result) {
      alert('Registro deletado com sucesso!')
      router.back()
      return
    }
    alert('Não foi possível deletar o registro!')
  }

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center p-6 bg-background">
        <ActivityIndicator size="large" className="mb-3" color="#000" />
        <Text className="text-lg font-medium text-background-content">
          Processando dados da foto...
        </Text>
      </View>
    )
  }

  function renderRegisterForm() {
    switch (register.type) {
      case 'trabalho':
        return (
          <View className="flex-1 gap-y-5 mt-4 space-y-4 w-full">
            <View className="w-full">
              <Text className="mb-1 text-lg font-medium text-background-content">Data</Text>
              <DateInput
                mode="date"
                value={new Date(register.date.split('/').reverse().join('-') + 'T00:00:00')}
                onChange={(value) => handleInputChange('date', value.toLocaleDateString('pt-BR'))}
              />
            </View>

            <View className="w-full">
              <Text className="mb-1 text-lg font-medium text-background-content">Hora</Text>
              <HourInput
                onChange={(value) =>
                  handleInputChange('timeInMinutes', convertTimeToMinutes(value))
                }
                value={convertMinutesToTime(register.timeInMinutes || 0)}
              />
            </View>

            <View className="w-full elevation">
              <Text className="mb-1 text-lg font-medium text-background-content">
                Foto do Ponto
              </Text>
              {register.photo ? (
                <TouchableOpacity
                  className="items-center p-3 w-full h-48 rounded-lg"
                  onPress={handleTakePhoto}
                >
                  <Image
                    source={{ uri: `${register.photo}` }}
                    className="w-full h-full rounded-lg bg-surface"
                    resizeMode="contain"
                    width={500}
                    height={500}
                  />
                </TouchableOpacity>
              ) : (
                <TouchableOpacity
                  onPress={handleTakePhoto}
                  className="justify-center items-center p-3 w-full h-48 rounded-lg bg-surface"
                >
                  <Entypo name="camera" size={50} color={colors[theme].surfaceContent} />
                </TouchableOpacity>
              )}
            </View>

            <View className="w-full">
              <Text className="mb-1 text-lg font-medium text-background-content">NSR</Text>
              <TextInput
                value={register.nsr || ''}
                onChangeText={(value) => handleInputChange('nsr', value)}
                className="p-2 rounded-md bg-surface text-surface-content"
                placeholder="Digite o NSR (Opcional)"
                placeholderTextColor={colors[theme].surfaceContent + '60'}
              />
            </View>
          </View>
        )
      default:
        return (
          <View className="flex-1 gap-y-5 mt-4 space-y-4 w-full">
            <View className="w-full">
              <Text className="mb-1 text-lg font-medium text-background-content">Data</Text>
              <DateInput
                mode="date"
                value={new Date(register.date.split('/').reverse().join('-') + 'T00:00:00')}
                onChange={(value) => handleInputChange('date', value.toLocaleDateString('pt-BR'))}
              />
            </View>
            <View className="w-full">
              <Text className="mb-1 text-lg font-medium text-background-content">
                Tipo de Abono
              </Text>
              <View className="flex-row gap-x-2 mb-4">
                <TouchableOpacity
                  className={`flex-1 items-center p-3 rounded-lg ${
                    register.isFullDay ? 'bg-primary' : 'bg-surface'
                  }`}
                  onPress={() => {
                    handleInputChange('isFullDay', true)
                    handleInputChange('timeInMinutes', (config?.workHours || 8) * 60)
                  }}
                >
                  <Text
                    className={`text-base font-medium ${
                      register.isFullDay ? 'text-primary-content' : 'text-surface-content'
                    }`}
                  >
                    Dia Todo
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  className={`flex-1 items-center p-3 rounded-lg ${
                    !register.isFullDay ? 'bg-primary' : 'bg-surface'
                  }`}
                  onPress={() => {
                    handleInputChange('isFullDay', false)
                    handleInputChange('timeInMinutes', 0)
                  }}
                >
                  <Text
                    className={`text-base font-medium ${
                      !register.isFullDay ? 'text-primary-content' : 'text-surface-content'
                    }`}
                  >
                    Horas
                  </Text>
                </TouchableOpacity>
              </View>
              {!register.isFullDay && (
                <HourInput
                  value={convertMinutesToTime(register.timeInMinutes || 0)}
                  onChange={(value) =>
                    handleInputChange('timeInMinutes', convertTimeToMinutes(value))
                  }
                  max={`${String(config?.workHours).padStart(2, '0') || '09'}:00` || '23:59'}
                />
              )}
            </View>

            <View className="w-full">
              <Text className="mb-1 text-lg font-medium text-background-content">Descrição</Text>
              <TextInput
                value={register.location || ''}
                onChangeText={(value) => handleInputChange('location', value)}
                className="p-2 rounded-md bg-surface text-surface-content"
                placeholder="Digite a descrição"
                placeholderTextColor={colors[theme].surfaceContent + '60'}
                multiline
                numberOfLines={3}
              />
            </View>

            <View className="w-full">
              <Text className="mb-1 text-lg font-medium text-background-content">Foto</Text>
              {register.photo ? (
                <TouchableOpacity
                  className="items-center w-full h-40 rounded-lg"
                  onPress={handleTakePhoto}
                >
                  <Image
                    source={{ uri: `${register.photo}` }}
                    className="w-full h-full rounded-lg bg-surface"
                    resizeMode="contain"
                    width={500}
                    height={500}
                  />
                </TouchableOpacity>
              ) : (
                <TouchableOpacity
                  onPress={handleTakePhoto}
                  className="justify-center items-center p-3 w-full h-48 rounded-lg bg-surface"
                >
                  <Entypo name="camera" size={50} color={colors[theme].surfaceContent} />
                </TouchableOpacity>
              )}
            </View>
          </View>
        )
    }
  }

  function renderFooter() {
    return (
      <View className="flex-row gap-x-2 w-full">
        <TouchableOpacity
          className="flex-1 items-center p-4 mt-6 rounded-lg bg-secondary"
          onPress={() => router.back()}
        >
          <Text className="text-lg font-bold text-secondary-content">Voltar</Text>
        </TouchableOpacity>

        <TouchableOpacity
          className="flex-1 items-center p-4 mt-6 rounded-lg bg-error"
          onPress={handleDeleteRegister}
        >
          <Text className="text-lg font-bold text-error-content">Deletar</Text>
        </TouchableOpacity>

        <TouchableOpacity
          className="flex-1 items-center p-4 mt-6 rounded-lg bg-success"
          onPress={handleUpdateRegister}
          disabled={loading}
        >
          <Text className="text-lg font-bold text-success-content">
            {loading ? 'Atualizando...' : 'Atualizar'}
          </Text>
        </TouchableOpacity>
      </View>
    )
  }

  function renderTypesForm() {
    const types = ['trabalho', 'folga', 'atestado']

    return (
      <View className="w-full">
        <Text className="mb-1 text-lg font-medium text-background-content">Tipo de Registro</Text>
        <View className="flex-row gap-x-2">
          {types.map((type) => (
            <TouchableOpacity
              key={type}
              className={`flex-1 items-center p-3 rounded-lg ${
                register.type === type ? 'bg-primary' : 'bg-surface'
              }`}
              onPress={() => handleInputChange('type', type)}
            >
              <Text
                className={`text-base font-medium ${
                  register.type === type ? 'text-primary-content' : 'text-surface-content'
                }`}
              >
                {type.charAt(0).toUpperCase() + type.slice(1)}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    )
  }

  return (
    <SafeAreaView className="flex-1 justify-between items-center px-3 pb-5 bg-background">
      <Header title="Editar" />
      {renderTypesForm()}
      {renderRegisterForm()}
      {renderFooter()}
    </SafeAreaView>
  )
}
function editRegister(arg0: number, register: any) {
  throw new Error('Function not implemented.')
}

function deleteRegister(arg0: number) {
  throw new Error('Function not implemented.')
}
