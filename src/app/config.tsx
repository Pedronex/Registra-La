import { Header } from '@/components/Header'
import ThemeToggle from '@/components/ToggleTheme'
import { Messages } from '@/constants/Messages'
import { useConfig } from '@/hooks/useConfig'
import { Alert } from '@/lib/Alert'
import { useTheme } from '@/providers/ThemeProvider'
import { colors } from '@/utils/colorThemes'
import { Entypo } from '@expo/vector-icons'
import { useRouter } from 'expo-router'
import { useEffect, useState } from 'react'
import { ScrollView, Switch, Text, TextInput, TouchableOpacity, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

/**
 * Página de configuração do aplicativo
 * Permite ao usuário definir horas de trabalho e tolerância
 */
export default function ConfigPage() {
  // Estados locais para os campos do formulário
  const [formState, setFormState] = useState({
    entraceTime: 480,
    entraceBufferTime: 720,
    exitBufferTime: 840,
    exitTime: 1080,
    tolerance: 10,
    companyName: '',
    workDays: [1, 2, 3, 4, 5],
    initialBalanceInMinutes: 0,
    notifications: true,
  })
  const [currentStep, setCurrentStep] = useState(0)
  const [sign, setSign] = useState<'+' | '-'>('+')

  // Hooks
  const router = useRouter()
  const { config, loading, saveConfig: persistConfig } = useConfig()
  const { theme } = useTheme()

  function handleChange(field: keyof typeof formState, value: (typeof formState)[typeof field]) {
    setFormState({ ...formState, [field]: value })
  }

  // Carrega configurações existentes quando o componente é montado
  useEffect(() => {
    if (config) {
      setFormState({
        entraceTime: config.entraceTime,
        exitTime: config.exitTime,
        entraceBufferTime: config.entraceBufferTime || 0,
        exitBufferTime: config.exitBufferTime || 0,
        tolerance: config.tolerance || 0,
        companyName: config.companyName || '',
        workDays: Array.isArray(config.workDays) ? config.workDays : [0],
        initialBalanceInMinutes: config.initialBalanceInMinutes || 0,
        notifications: config.notifications ?? true,
      })
    }
  }, [config])

  const nextStep = () => setCurrentStep(currentStep + 1)
  const prevStep = () => setCurrentStep(currentStep - 1)

  /**
   * Salva as configurações e navega para a página inicial
   */
  const handleSaveConfig = async () => {
    try {
      await persistConfig(formState)

      Alert.success(Messages.success.config.save)
      router.push('/(tabs)/')
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : Messages.errors.config.save
      Alert.error(errorMessage)
    }
  }

  useEffect(() => {
    setSign(formState.initialBalanceInMinutes >= 0 ? '+' : '-')
  }, [formState.initialBalanceInMinutes])

  const handleSignPress = (newSign: '+' | '-') => {
    setSign(newSign)
    const absValue = Math.abs(formState.initialBalanceInMinutes)
    handleChange('initialBalanceInMinutes', newSign === '+' ? absValue : -absValue)
  }

  const handleHoursChange = (text: string) => {
    const numericValue = text.replace(/[^0-9]/g, '')
    const hours = Number(numericValue) || 0
    const minutes = Math.abs(formState.initialBalanceInMinutes) % 60
    const total = hours * 60 + minutes
    handleChange('initialBalanceInMinutes', sign === '+' ? total : -total)
  }

  const handleMinutesChange = (text: string) => {
    const numericValue = text.replace(/[^0-9]/g, '')
    const minutes = Math.min(59, Number(numericValue) || 0)
    const hours = Math.floor(Math.abs(formState.initialBalanceInMinutes) / 60)
    const total = hours * 60 + minutes
    handleChange('initialBalanceInMinutes', sign === '+' ? total : -total)
  }

  /**
   * Renderiza o campo de entrada para horas de trabalho
   */
  const renderWorkHoursInput = () => (
    <View className="gap-y-4">
      {/* Entrada */}
      <View>
        <Text className="mb-1 text-sm font-medium text-background-content">Entrada</Text>
        <View className="flex-row gap-x-2">
          <TextInput
            className="flex-1 px-4 py-3 rounded-lg border bg-surface border-surface-content text-background-content"
            keyboardType="numeric"
            placeholder="HH"
            placeholderTextColor={colors[theme].surfaceContent + '80'}
            value={Math.floor(formState.entraceTime / 60)
              .toString()
              .padStart(2, '0')}
            onChangeText={(text) => {
              const hours = Number(text.replace(/[^0-9]/g, '')) || 0
              const minutes = formState.entraceTime % 60
              handleChange('entraceTime', hours * 60 + minutes)
            }}
            accessibilityLabel="Hora de entrada"
            accessibilityHint="Digite a hora de entrada"
          />
          <TextInput
            className="flex-1 px-4 py-3 rounded-lg border bg-surface border-surface-content text-background-content"
            keyboardType="numeric"
            placeholder="MM"
            placeholderTextColor={colors[theme].surfaceContent + '80'}
            value={(formState.entraceTime % 60).toString().padStart(2, '0')}
            onChangeText={(text) => {
              const minutes = Number(text.replace(/[^0-9]/g, '')) || 0
              const hours = Math.floor(formState.entraceTime / 60)
              handleChange('entraceTime', hours * 60 + Math.min(59, minutes))
            }}
            accessibilityLabel="Minuto de entrada"
            accessibilityHint="Digite o minuto de entrada"
          />
        </View>
      </View>

      {/* Entrada para o almoço */}
      <View>
        <Text className="mb-1 text-sm font-medium text-background-content">
          Entrada para o Almoço
        </Text>
        <View className="flex-row gap-x-2">
          <TextInput
            className="flex-1 px-4 py-3 rounded-lg border bg-surface border-surface-content text-background-content"
            keyboardType="numeric"
            placeholder="HH"
            placeholderTextColor={colors[theme].surfaceContent + '80'}
            value={Math.floor(formState.entraceBufferTime / 60)
              .toString()
              .padStart(2, '0')}
            onChangeText={(text) => {
              const hours = Number(text.replace(/[^0-9]/g, '')) || 0
              const minutes = formState.entraceBufferTime % 60
              handleChange('entraceBufferTime', hours * 60 + minutes)
            }}
            accessibilityLabel="Hora de entrada para o almoço"
            accessibilityHint="Digite a hora de entrada para o almoço"
          />
          <TextInput
            className="flex-1 px-4 py-3 rounded-lg border bg-surface border-surface-content text-background-content"
            keyboardType="numeric"
            placeholder="MM"
            placeholderTextColor={colors[theme].surfaceContent + '80'}
            value={(formState.entraceBufferTime % 60).toString().padStart(2, '0')}
            onChangeText={(text) => {
              const minutes = Number(text.replace(/[^0-9]/g, '')) || 0
              const hours = Math.floor(formState.entraceBufferTime / 60)
              handleChange('entraceBufferTime', hours * 60 + Math.min(59, minutes))
            }}
            accessibilityLabel="Minuto de entrada para o almoço"
            accessibilityHint="Digite o minuto de entrada para o almoço"
          />
        </View>
      </View>

      {/* Saída para o almoço */}
      <View>
        <Text className="mb-1 text-sm font-medium text-background-content">
          Saída para o Almoço
        </Text>
        <View className="flex-row gap-x-2">
          <TextInput
            className="flex-1 px-4 py-3 rounded-lg border bg-surface border-surface-content text-background-content"
            keyboardType="numeric"
            placeholder="HH"
            placeholderTextColor={colors[theme].surfaceContent + '80'}
            value={Math.floor(formState.exitBufferTime / 60)
              .toString()
              .padStart(2, '0')}
            onChangeText={(text) => {
              const hours = Number(text.replace(/[^0-9]/g, '')) || 0
              const minutes = formState.exitBufferTime % 60
              handleChange('exitBufferTime', hours * 60 + minutes)
            }}
            accessibilityLabel="Hora de saída para o almoço"
            accessibilityHint="Digite a hora de saída para o almoço"
          />
          <TextInput
            className="flex-1 px-4 py-3 rounded-lg border bg-surface border-surface-content text-background-content"
            keyboardType="numeric"
            placeholder="MM"
            placeholderTextColor={colors[theme].surfaceContent + '80'}
            value={(formState.exitBufferTime % 60).toString().padStart(2, '0')}
            onChangeText={(text) => {
              const minutes = Number(text.replace(/[^0-9]/g, '')) || 0
              const hours = Math.floor(formState.exitBufferTime / 60)
              handleChange('exitBufferTime', hours * 60 + Math.min(59, minutes))
            }}
            accessibilityLabel="Minuto de saída para o almoço"
            accessibilityHint="Digite o minuto de saída para o almoço"
          />
        </View>
      </View>

      {/* Saída */}
      <View>
        <Text className="mb-1 text-sm font-medium text-background-content">Saída</Text>
        <View className="flex-row gap-x-2">
          <TextInput
            className="flex-1 px-4 py-3 rounded-lg border bg-surface border-surface-content text-background-content"
            keyboardType="numeric"
            placeholder="HH"
            placeholderTextColor={colors[theme].surfaceContent + '80'}
            value={Math.floor(formState.exitTime / 60)
              .toString()
              .padStart(2, '0')}
            onChangeText={(text) => {
              const hours = Number(text.replace(/[^0-9]/g, '')) || 0
              const minutes = formState.exitTime % 60
              handleChange('exitTime', hours * 60 + minutes)
            }}
            accessibilityLabel="Hora de saída"
            accessibilityHint="Digite a hora de saída"
          />
          <TextInput
            className="flex-1 px-4 py-3 rounded-lg border bg-surface border-surface-content text-background-content"
            keyboardType="numeric"
            placeholder="MM"
            placeholderTextColor={colors[theme].surfaceContent + '80'}
            value={(formState.exitTime % 60).toString().padStart(2, '0')}
            onChangeText={(text) => {
              const minutes = Number(text.replace(/[^0-9]/g, '')) || 0
              const hours = Math.floor(formState.exitTime / 60)
              handleChange('exitTime', hours * 60 + Math.min(59, minutes))
            }}
            accessibilityLabel="Minuto de saída"
            accessibilityHint="Digite o minuto de saída"
          />
        </View>
      </View>
    </View>
  )

  /**
   * Renderiza o campo de entrada para tolerância
   */
  const renderToleranceInput = () => (
    <View>
      <Text className="mb-1 text-sm font-medium text-background-content">
        Tolerância (em minutos)
      </Text>
      <TextInput
        className="px-4 py-3 w-full rounded-lg border bg-surface border-surface-content text-background-content"
        keyboardType="numeric"
        placeholder="Ex: 15"
        placeholderTextColor={colors[theme].surfaceContent + '80'}
        value={formState.tolerance.toString()}
        onChangeText={(text) => {
          const numericValue = text.replace(/[^0-9]/g, '')
          handleChange('tolerance', Number(numericValue))
        }}
        accessibilityLabel="Tolerância em minutos"
        accessibilityHint="Digite o número de minutos de tolerância"
      />
    </View>
  )

  const renderInitialBalanceInput = () => (
    <View>
      <Text className="mb-1 text-sm font-medium text-background-content">Saldo Inicial</Text>
      <View className="flex-row items-center gap-x-2">
        <TouchableOpacity
          className={`px-4 py-2 rounded-lg ${sign === '+' ? 'bg-primary' : 'bg-surface'}`}
          onPress={() => handleSignPress('+')}
        >
          <Text className={`${sign === '+' ? 'text-primary-content' : 'text-surface-content'}`}>
            +
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          className={`px-4 py-2 rounded-lg ${sign === '-' ? 'bg-primary' : 'bg-surface'}`}
          onPress={() => handleSignPress('-')}
        >
          <Text className={`${sign === '-' ? 'text-primary-content' : 'text-surface-content'}`}>
            -
          </Text>
        </TouchableOpacity>
      </View>
      <View className="flex-col items-start gap-x-2">
        <Text className="font-bold text-background-content">Horas</Text>
        <TextInput
          className="px-4 py-3 rounded-lg border bg-surface border-surface-content text-background-content text-center"
          keyboardType="numeric"
          placeholder="HH"
          value={Math.floor(Math.abs(formState.initialBalanceInMinutes) / 60)
            .toString()
            .padStart(2, '0')}
          onChangeText={handleHoursChange}
        />
      </View>
      <View className="flex-col items-start gap-x-2">
        <Text className="font-bold text-background-content">Minutos</Text>
        <TextInput
          className="px-4 py-3 rounded-lg border bg-surface border-surface-content text-background-content text-center"
          keyboardType="numeric"
          placeholder="MM"
          value={(Math.abs(formState.initialBalanceInMinutes) % 60).toString().padStart(2, '0')}
          onChangeText={handleMinutesChange}
        />
      </View>
    </View>
  )

  /**
   * Renderiza o campo de entrada para nome da empresa
   */
  const renderCompanyNameInput = () => (
    <View>
      <Text className="mb-1 text-sm font-medium text-background-content">Nome da Empresa</Text>
      <TextInput
        className="px-4 py-3 w-full rounded-lg border bg-surface border-surface-content text-background-content"
        placeholder="Ex: Empresa XYZ"
        placeholderTextColor={colors[theme].surfaceContent + '80'}
        value={formState.companyName}
        onChangeText={(text) => handleChange('companyName', text)}
        accessibilityLabel="Nome da empresa"
        accessibilityHint="Digite o nome da empresa"
      />
    </View>
  )

  /**
   * Renderiza o campo de entrada para dias da semana trabalhados
   */
  const renderWorkDaysInput = () => (
    <View>
      <Text className="mb-1 text-sm font-medium text-background-content">
        Dias da Semana Trabalhados
      </Text>
      <View className="flex flex-row flex-wrap gap-2 font-medium text-background-content">
        {[
          { label: 'Segunda', value: 1 },
          { label: 'Terça', value: 2 },
          { label: 'Quarta', value: 3 },
          { label: 'Quinta', value: 4 },
          { label: 'Sexta', value: 5 },
          { label: 'Sábado', value: 6 },
          { label: 'Domingo', value: 0 },
        ].map((day) => (
          <TouchableOpacity
            key={day.value}
            onPress={() =>
              handleChange(
                'workDays',
                formState.workDays.includes(day.value)
                  ? formState.workDays.filter((d) => d !== day.value)
                  : [...formState.workDays, day.value],
              )
            }
            className={`px-3 py-2 rounded-lg border ${formState.workDays.includes(day.value) ? 'bg-primary border-primary' : 'bg-transparent border-surface-content'}`}
          >
            <Text
              className={`text-sm font-medium ${formState.workDays.includes(day.value) ? 'text-primary-content' : 'text-background-content'}`}
            >
              {day.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  )

  const renderToggleTheme = () => (
    <View>
      <Text className="mb-1 text-sm font-medium text-background-content">Tema do Aplicativo</Text>
      <ThemeToggle />
    </View>
  )

  const renderNotificationsToggle = () => (
    <View>
      <Text className="mb-1 text-sm font-medium text-background-content">Notificações</Text>
      <View className="flex-row items-center justify-between p-4 rounded-lg bg-surface">
        <Text className="text-background-content">Ativar lembretes de ponto</Text>
        <Switch
          trackColor={{ false: '#767577', true: colors[theme].primary }}
          thumbColor={formState.notifications ? '#f4f3f4' : '#f4f3f4'}
          onValueChange={(value) => handleChange('notifications', value)}
          value={formState.notifications}
        />
      </View>
    </View>
  )

  return (
    <SafeAreaView className="flex-1 bg-background">
      <Header
        showConfig={false}
        title="Configurações"
        back={
          config
            ? () => (
                <TouchableOpacity
                  onPress={() => router.back()}
                  className="rounded-lg"
                  accessibilityRole="button"
                  accessibilityLabel="Voltar"
                >
                  <Entypo name="chevron-left" size={35} color={colors[theme].primary} />
                </TouchableOpacity>
              )
            : undefined
        }
      />
      <ScrollView className="flex-1 px-4 py-6">
        <View className="space-y-6">
          <View>
            <Text className="mb-2 text-lg font-semibold text-background-content">
              Configurações iniciais
            </Text>
            <Text className="mb-4 text-sm font-medium text-background-content">
              {currentStep === 0 && 'Selecione o Tema'}
              {currentStep === 1 && 'Passo 1: Horas de Trabalho'}
              {currentStep === 2 && 'Passo 2: Detalhes da Empresa'}
              {currentStep === 3 && 'Passo 3: Integrações'}
            </Text>
          </View>

          <View className="flex flex-col gap-y-4">
            {currentStep === 0 && <>{renderToggleTheme()}</>}
            {currentStep === 1 && (
              <>
                {renderWorkHoursInput()}
                {renderWorkDaysInput()}
                {renderNotificationsToggle()}
              </>
            )}

            {currentStep === 2 && (
              <>
                {renderCompanyNameInput()}
                {renderToleranceInput()}
                {renderInitialBalanceInput()}
              </>
            )}

            <View className="flex flex-row gap-x-4 justify-center mt-6">
              {currentStep > 1 && (
                <TouchableOpacity
                  className="p-3 w-28 rounded-lg border bg-tertiary border-primary"
                  onPress={prevStep}
                  accessibilityLabel="Voltar"
                  accessibilityRole="button"
                >
                  <Text className="font-medium text-center text-background-content">Voltar</Text>
                </TouchableOpacity>
              )}

              {currentStep < 2 && (
                <TouchableOpacity
                  className="p-3 w-28 rounded-lg bg-primary"
                  onPress={nextStep}
                  accessibilityLabel="Próximo"
                  accessibilityRole="button"
                >
                  <Text className="text-center text-primary-content">Próximo</Text>
                </TouchableOpacity>
              )}

              {currentStep === 2 && (
                <TouchableOpacity
                  className="p-3 w-28 rounded-lg bg-primary"
                  onPress={handleSaveConfig}
                  accessibilityLabel="Salvar configurações"
                  accessibilityRole="button"
                  disabled={loading}
                >
                  <Text className="text-center text-primary-content">
                    {loading ? 'Salvando...' : 'Salvar'}
                  </Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}
