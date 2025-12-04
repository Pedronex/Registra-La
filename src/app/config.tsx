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
import { ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native'
import { CheckBox } from 'react-native-elements'
import { SafeAreaView } from 'react-native-safe-area-context'

/**
 * Página de configuração do aplicativo
 * Permite ao usuário definir horas de trabalho e tolerância
 */
export default function ConfigPage() {
  // Estados locais para os campos do formulário
  const [workHours, setWorkHours] = useState<number>(0)
  const [tolerance, setTolerance] = useState<number>(0)
  const [companyName, setCompanyName] = useState<string>('')
  const [breakTime, setBreakTime] = useState<number>(0)
  const [workDays, setWorkDays] = useState<number[]>([])
  const [initialBalanceHours, setInitialBalanceHours] = useState<number>(0)
  const [initialBalanceMinutes, setInitialBalanceMinutes] = useState<number>(0)
  const [initialBalanceSign, setInitialBalanceSign] = useState<'positive' | 'negative'>('positive')
  const [currentStep, setCurrentStep] = useState(1)

  // Hooks
  const router = useRouter()
  const { config, loading, saveConfig: persistConfig } = useConfig()
  const { theme } = useTheme()

  // Carrega configurações existentes quando o componente é montado
  useEffect(() => {
    if (config) {
      setWorkHours(config.workHours)
      setTolerance(config.tolerance || 0)
      setCompanyName(config.companyName || '')
      setBreakTime(config.breakTime || 0)
      setWorkDays(Array.isArray(config.workDays) ? config.workDays : [])

      const balance = config.initialBalanceInMinutes || 0
      setInitialBalanceSign(balance < 0 ? 'negative' : 'positive')
      const absoluteBalance = Math.abs(balance)
      const hours = Math.floor(absoluteBalance / 60)
      const minutes = Math.round(absoluteBalance % 60)
      setInitialBalanceHours(hours)
      setInitialBalanceMinutes(minutes)
    }
  }, [config])

  const nextStep = () => setCurrentStep(currentStep + 1)
  const prevStep = () => setCurrentStep(currentStep - 1)

  /**
   * Salva as configurações e navega para a página inicial
   */
  const handleSaveConfig = async () => {
    try {
      const totalMinutes = initialBalanceHours * 60 + initialBalanceMinutes

      await persistConfig({
        workHours,
        tolerance,
        companyName,
        breakTime,
        workDays,
        initialBalanceInMinutes: initialBalanceSign === 'negative' ? -totalMinutes : totalMinutes,
        id: 1,
      })

      Alert.success(Messages.success.config.save)
      router.push('/(tabs)/')
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : Messages.errors.config.save
      Alert.error(errorMessage)
    }
  }

  /**
   * Renderiza o campo de entrada para horas de trabalho
   */
  const renderWorkHoursInput = () => (
    <View>
      <Text className="mb-1 text-sm font-medium text-background-content">
        Horas de Trabalho Diárias
      </Text>
      <TextInput
        className="px-4 py-3 w-full rounded-lg border bg-surface border-surface-content text-background-content"
        keyboardType="numeric"
        placeholder="Ex: 8"
        placeholderTextColor={colors[theme].surfaceContent + '80'}
        value={isNaN(workHours) ? '' : workHours.toString()}
        onChangeText={(text) => {
          const numericValue = text.replace(/[^0-9]/g, '')
          setWorkHours(numericValue === '' ? 0 : Number(numericValue))
        }}
        accessibilityLabel="Horas de trabalho diárias"
        accessibilityHint="Digite o número de horas de trabalho por dia"
      />
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
        value={isNaN(tolerance) ? '' : tolerance.toString()}
        onChangeText={(text) => {
          const numericValue = text.replace(/[^0-9]/g, '')
          setTolerance(numericValue === '' ? 0 : Number(numericValue))
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
          className={`px-4 py-2 rounded-lg ${initialBalanceSign === 'positive' ? 'bg-primary' : 'bg-surface'}`}
          onPress={() => setInitialBalanceSign('positive')}
        >
          <Text
            className={`${initialBalanceSign === 'positive' ? 'text-primary-content' : 'text-surface-content'}`}
          >
            +
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          className={`px-4 py-2 rounded-lg ${initialBalanceSign === 'negative' ? 'bg-primary' : 'bg-surface'}`}
          onPress={() => setInitialBalanceSign('negative')}
        >
          <Text
            className={`${initialBalanceSign === 'negative' ? 'text-primary-content' : 'text-surface-content'}`}
          >
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
          value={initialBalanceHours.toString()}
          onChangeText={(text) => {
            const numericValue = text.replace(/[^0-9]/g, '')
            setInitialBalanceHours(numericValue === '' ? 0 : Number(numericValue))
          }}
        />
      </View>
      <View className="flex-col items-start gap-x-2">
        <Text className="font-bold text-background-content">Minutos</Text>
        <TextInput
          className="px-4 py-3 rounded-lg border bg-surface border-surface-content text-background-content text-center"
          keyboardType="numeric"
          placeholder="Minutos"
          value={initialBalanceMinutes.toString().padStart(2, '0')}
          onChangeText={(text) => {
            const numericValue = text.replace(/[^0-9]/g, '')
            const minutes = Number(numericValue)
            setInitialBalanceMinutes(minutes > 59 ? 59 : minutes)
          }}
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
        value={companyName}
        onChangeText={setCompanyName}
        accessibilityLabel="Nome da empresa"
        accessibilityHint="Digite o nome da empresa"
      />
    </View>
  )

  /**
   * Renderiza o campo de entrada para intervalo de trabalho
   */
  const renderBreakTimeInput = () => (
    <View>
      <Text className="mb-1 text-sm font-medium text-background-content">
        Intervalo de Trabalho (em minutos)
      </Text>
      <TextInput
        className="px-4 py-3 w-full rounded-lg border bg-surface border-surface-content text-background-content"
        keyboardType="numeric"
        placeholder="Ex: 15"
        placeholderTextColor={colors[theme].surfaceContent + '80'}
        value={isNaN(breakTime) ? '' : breakTime.toString()}
        onChangeText={(text) => {
          const numericValue = text.replace(/[^0-9]/g, '')
          setBreakTime(numericValue === '' ? 0 : Number(numericValue))
        }}
        accessibilityLabel="Intervalo de trabalho em minutos"
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
          { label: 'segunda', value: 1 },
          { label: 'terça', value: 2 },
          { label: 'quarta', value: 3 },
          { label: 'quinta', value: 4 },
          { label: 'sexta', value: 5 },
          { label: 'sábado', value: 6 },
          { label: 'domingo', value: 0 },
        ].map((day) => (
          <CheckBox
            key={day.value}
            title={day.label}
            checked={workDays.includes(day.value)}
            onPress={() =>
              setWorkDays((prev) =>
                prev.includes(day.value)
                  ? prev.filter((d) => d !== day.value)
                  : [...prev, day.value],
              )
            }
            containerStyle={{
              backgroundColor: 'transparent',
              borderWidth: 0,
              padding: 8,
              margin: 0,
            }}
            textStyle={{
              color: colors[theme].backgroundColor,
              fontWeight: '500',
            }}
            checkedColor={colors[theme].primary}
            uncheckedColor={colors[theme].secondary}
          />
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
              Configuração de Horas de Trabalho
            </Text>
            <Text className="mb-4 text-sm font-medium text-background-content">
              {currentStep === 1 && 'Passo 1: Horas de Trabalho'}
              {currentStep === 2 && 'Passo 2: Detalhes da Empresa'}
              {currentStep === 3 && 'Passo 3: Integrações'}
            </Text>
          </View>

          <View className="flex flex-col gap-y-4">
            {currentStep === 1 && (
              <>
                {renderToggleTheme()}
                {renderWorkHoursInput()}
                {renderWorkDaysInput()}
                {renderBreakTimeInput()}
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
