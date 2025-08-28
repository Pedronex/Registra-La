import { Messages } from "@/constants/Messages";
import { useConfig } from "@/hooks/useConfig";
import { Alert } from "@/lib/Alert";
import * as Clipboard from 'expo-clipboard';
import { useFocusEffect, useRouter } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import { Linking, ScrollView, Text, TextInput, TouchableOpacity, View } from "react-native";
import { CheckBox } from "react-native-elements";
import { SafeAreaView } from "react-native-safe-area-context";

/**
 * Página de configuração do aplicativo
 * Permite ao usuário definir horas de trabalho e tolerância
 */
export default function ConfigPage() {
  // Estados locais para os campos do formulário
  const [workHours, setWorkHours] = useState<number>(0);
  const [tolerance, setTolerance] = useState<number>(0);
  const [companyName, setCompanyName] = useState<string>('');
  const [breakTime, setBreakTime] = useState<number>(0);
  const [workDays, setWorkDays] = useState<string[]>([]);
  const [geminiApiKey, setGeminiApiKey] = useState<string>('');
  const [isPasteAvailable, setIsPasteAvailable] = useState(false);
  
  // Hooks
  const router = useRouter();
  const { config, loading, saveConfig: persistConfig } = useConfig();

  // Carrega configurações existentes quando o componente é montado
  useEffect(() => {
    if (config) {
      setWorkHours(config.workHours);
      setTolerance(config.tolerance || 0);
      setCompanyName(config.companyName || '');
      setBreakTime(config.breakTime || 0);
      setWorkDays(Array.isArray(config.workDays) ? config.workDays : []);
      setGeminiApiKey(config.geminiApiKey || '');
    }
  }, [config]);

  useFocusEffect(
    useCallback(() => {
      const checkClipboard = async () => {
        const hasString = await Clipboard.hasStringAsync();
        setIsPasteAvailable(hasString);
      };
      checkClipboard();
    }, [])
  );

  /**
   * Salva as configurações e navega para a página inicial
   */
  const handleSaveConfig = async () => {
    try {
      await persistConfig({
        workHours,
        tolerance,
        companyName,
        breakTime,
        workDays,
        geminiApiKey,
      });
      
      Alert.success(Messages.success.config.save);
      router.push("/home");
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : Messages.errors.config.save;
      Alert.error(errorMessage);
    }
  }


  /**
   * Renderiza o campo de entrada para horas de trabalho
   */
  const renderWorkHoursInput = () => (
    <View>
      <Text className="mb-1 text-sm font-medium text-gray-700 dark:text-white">
        Horas de Trabalho Diárias
      </Text>
      <TextInput
        className="px-4 py-3 w-full bg-white rounded-lg border border-gray-300 dark:bg-gray-700 dark:border-gray-600"
        keyboardType="numeric"
        placeholder="Ex: 8"
        value={workHours.toString()}
        onChangeText={(text) => setWorkHours(Number(text))}
        accessibilityLabel="Horas de trabalho diárias"
        accessibilityHint="Digite o número de horas de trabalho por dia"
      />
    </View>
  );

  /**
   * Renderiza o campo de entrada para tolerância
   */
  const renderToleranceInput = () => (
    <View>
      <Text className="mb-1 text-sm font-medium text-gray-700 dark:text-white">
        Tolerância (em minutos)
      </Text>
      <TextInput
        className="px-4 py-3 w-full bg-white rounded-lg border border-gray-300 dark:bg-gray-700 dark:border-gray-600"
        keyboardType="numeric"
        placeholder="Ex: 15"
        value={tolerance.toString()}
        onChangeText={(text) => setTolerance(Number(text))}
        accessibilityLabel="Tolerância em minutos"
        accessibilityHint="Digite o número de minutos de tolerância"
      />
    </View>
  );

  /**
   * Renderiza o campo de entrada para nome da empresa
   */
  const renderCompanyNameInput = () => (
    <View>
      <Text className="mb-1 text-sm font-medium text-gray-700 dark:text-white">
        Nome da Empresa
      </Text>
      <TextInput
        className="px-4 py-3 w-full bg-white rounded-lg border border-gray-300 dark:bg-gray-700 dark:border-gray-600"
        placeholder="Ex: Empresa XYZ"
        value={companyName}
        onChangeText={setCompanyName}
        accessibilityLabel="Nome da empresa"
        accessibilityHint="Digite o nome da empresa"
      />
    </View>
  );

  /**
   * Renderiza o campo de entrada para intervalo de trabalho
   */
  const renderBreakTimeInput = () => (
    <View>
      <Text className="mb-1 text-sm font-medium text-gray-700 dark:text-white">
        Intervalo de Trabalho (em minutos)
      </Text>
      <TextInput
        className="px-4 py-3 w-full bg-white rounded-lg border border-gray-300 dark:bg-gray-700 dark:border-gray-600"
        keyboardType="numeric"
        placeholder="Ex: 15"
        value={breakTime.toString()}
        onChangeText={(text) => setBreakTime(Number(text))}
        accessibilityLabel="Intervalo de trabalho em minutos"
      />
    </View>
  );

  /**
   * Renderiza o campo de entrada para dias da semana trabalhados
   */
  const renderWorkDaysInput = () => (
    <View>
      <Text className="mb-1 text-sm font-medium text-gray-700 dark:text-white">
        Dias da Semana Trabalhados
      </Text>
      <View className="flex flex-row flex-wrap gap-2">
        {[
          'segunda', 'terça', 'quarta', 'quinta', 'sexta', 'sábado', 'domingo'
        ].map((day) => (
          <CheckBox
            key={day}
            title={day}
            checked={workDays.includes(day)}
            onPress={() => setWorkDays(prev => 
              prev.includes(day) ? prev.filter(d => d !== day) : [...prev, day]
            )}
            containerStyle={{
              backgroundColor: 'transparent',
              borderWidth: 0,
            }}
            checkedColor="green"
            uncheckedColor="gray"
          />
        ))}
      </View>
    </View>
  )

  const handlePasteApiKey = async () => {
    const text = await Clipboard.getStringAsync();
    setGeminiApiKey(text);
  };

  const renderGeminiApiKeyInput = () => (
    <View>
      <Text className="mb-1 text-sm font-medium text-gray-700 dark:text-white">
        Gemini API Key
      </Text>
      <View className="flex-row items-center">
        <TextInput
          className="flex-1 px-4 py-3 w-full bg-white rounded-lg border border-gray-300 dark:bg-gray-700 dark:border-gray-600"
          placeholder="Insira sua API Key do Gemini"
          value={geminiApiKey}
          onChangeText={setGeminiApiKey}
          accessibilityLabel="Gemini API Key"
          accessibilityHint="Insira sua API Key do Gemini"
        />
        {isPasteAvailable && (
          <TouchableOpacity onPress={handlePasteApiKey} className="p-2 ml-2 bg-gray-200 dark:bg-gray-600 rounded-lg">
            <Text className="text-sm text-gray-700 dark:text-white">Colar</Text>
          </TouchableOpacity>
        )}
      </View>
      <TouchableOpacity onPress={() => Linking.openURL('https://aistudio.google.com/app/apikey')}>
        <Text className="mt-1 text-sm text-blue-500 dark:text-blue-400">
          Obtenha sua chave de API aqui
        </Text>
      </TouchableOpacity>
    </View>
  )

  return (
    <SafeAreaView className="flex-1 bg-neutral-100 dark:bg-gray-800">
      <ScrollView className="flex-1 px-4 py-6">
        <View className="space-y-6">
          {/* Cabeçalho */}
          <View>
            <Text className="mb-2 text-lg font-semibold text-gray-800 dark:text-white">
              Configuração de Horas de Trabalho
            </Text>
            <Text className="mb-4 text-sm text-gray-600 dark:text-gray-200">
              Por favor, insira suas horas de trabalho diárias e tempo de tolerância
            </Text>
          </View>

          {/* Formulário */}
          <View className="flex flex-col gap-y-4">
            {renderWorkHoursInput()}
            {renderToleranceInput()}
            {renderCompanyNameInput()}
            {renderBreakTimeInput()}
            {renderWorkDaysInput()}
            {renderGeminiApiKeyInput()}


            {/* Botão de salvar */}
            <TouchableOpacity
              className="p-3 w-full bg-blue-500 rounded-lg"
              onPress={handleSaveConfig}
              accessibilityLabel="Salvar configurações"
              accessibilityRole="button"
              disabled={loading}
            >
              <Text className="text-center text-white">
                {loading ? "Salvando..." : "Salvar"}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
