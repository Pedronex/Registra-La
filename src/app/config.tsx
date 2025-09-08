import { Header } from "@/components/Header";
import ThemeToggle from "@/components/ToggleTheme";
import { Messages } from "@/constants/Messages";
import { useConfig } from "@/hooks/useConfig";
import { Alert } from "@/lib/Alert";
import { useTheme } from "@/providers/ThemeProvider";
import { colors } from "@/utils/colorThemes";
import { Entypo } from "@expo/vector-icons";
import * as Clipboard from "expo-clipboard";
import { useFocusEffect, useRouter } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import {
  Linking,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
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
  const [companyName, setCompanyName] = useState<string>("");
  const [breakTime, setBreakTime] = useState<number>(0);
  const [workDays, setWorkDays] = useState<string[]>([]);
  const [geminiApiKey, setGeminiApiKey] = useState<string>("");
  const [isPasteAvailable, setIsPasteAvailable] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);

  // Hooks
  const router = useRouter();
  const { config, loading, saveConfig: persistConfig } = useConfig();
  const { theme } = useTheme();

  // Carrega configurações existentes quando o componente é montado
  useEffect(() => {
    if (config) {
      setWorkHours(config.workHours);
      setTolerance(config.tolerance || 0);
      setCompanyName(config.companyName || "");
      setBreakTime(config.breakTime || 0);
      setWorkDays(Array.isArray(config.workDays) ? config.workDays : []);
      setGeminiApiKey(config.geminiApiKey || "");
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

  const nextStep = () => setCurrentStep(currentStep + 1);
  const prevStep = () => setCurrentStep(currentStep - 1);

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
      router.push("/(tabs)/");
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : Messages.errors.config.save;
      Alert.error(errorMessage);
    }
  };

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
        placeholderTextColor={colors[theme].surfaceContent + "80"}
        value={isNaN(workHours) ? "" : workHours.toString()}
        onChangeText={(text) => {
          const numericValue = text.replace(/[^0-9]/g, "");
          setWorkHours(numericValue === "" ? 0 : Number(numericValue));
        }}
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
      <Text className="mb-1 text-sm font-medium text-background-content">
        Tolerância (em minutos)
      </Text>
      <TextInput
        className="px-4 py-3 w-full rounded-lg border bg-surface border-surface-content text-background-content"
        keyboardType="numeric"
        placeholder="Ex: 15"
        placeholderTextColor={colors[theme].surfaceContent + "80"}
        value={isNaN(tolerance) ? "" : tolerance.toString()}
        onChangeText={(text) => {
          const numericValue = text.replace(/[^0-9]/g, "");
          setTolerance(numericValue === "" ? 0 : Number(numericValue));
        }}
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
      <Text className="mb-1 text-sm font-medium text-background-content">
        Nome da Empresa
      </Text>
      <TextInput
        className="px-4 py-3 w-full rounded-lg border bg-surface border-surface-content text-background-content"
        placeholder="Ex: Empresa XYZ"
        placeholderTextColor={colors[theme].surfaceContent + "80"}
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
      <Text className="mb-1 text-sm font-medium text-background-content">
        Intervalo de Trabalho (em minutos)
      </Text>
      <TextInput
        className="px-4 py-3 w-full rounded-lg border bg-surface border-surface-content text-background-content"
        keyboardType="numeric"
        placeholder="Ex: 15"
        placeholderTextColor={colors[theme].surfaceContent + "80"}
        value={isNaN(breakTime) ? "" : breakTime.toString()}
        onChangeText={(text) => {
          const numericValue = text.replace(/[^0-9]/g, "");
          setBreakTime(numericValue === "" ? 0 : Number(numericValue));
        }}
        accessibilityLabel="Intervalo de trabalho em minutos"
      />
    </View>
  );

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
          "segunda",
          "terça",
          "quarta",
          "quinta",
          "sexta",
          "sábado",
          "domingo",
        ].map((day) => (
          <CheckBox
            key={day}
            title={day}
            checked={workDays.includes(day)}
            onPress={() =>
              setWorkDays((prev) =>
                prev.includes(day)
                  ? prev.filter((d) => d !== day)
                  : [...prev, day]
              )
            }
            containerStyle={{
              backgroundColor: "transparent",
              borderWidth: 0,
              padding: 8,
              margin: 0,
            }}
            textStyle={{
              color: colors[theme].backgroundColor,
              fontWeight: "500",
            }}
            checkedColor={colors[theme].primary}
            uncheckedColor={colors[theme].secondary}
          />
        ))}
      </View>
    </View>
  );

  const handlePasteApiKey = async () => {
    const text = await Clipboard.getStringAsync();
    setGeminiApiKey(text);
  };

  const renderToggleTheme = () => (
    <View>
      <Text className="mb-1 text-sm font-medium text-background-content">
        Tema do Aplicativo
      </Text>
      <ThemeToggle />
    </View>
  );

  const renderGeminiApiKeyInput = () => (
    <View>
      <Text className="mb-1 text-sm font-medium text-background-content">
        Gemini API Key
      </Text>
      <View className="flex-row items-center">
        <TextInput
          className="flex-1 px-4 py-3 w-full rounded-lg border bg-surface border-surface-content text-background-content"
          placeholder="Insira sua API Key do Gemini"
          placeholderTextColor={colors[theme].surfaceContent + "80"}
          value={geminiApiKey}
          onChangeText={setGeminiApiKey}
          accessibilityLabel="Gemini API Key"
          accessibilityHint="Insira sua API Key do Gemini"
        />
        {isPasteAvailable && (
          <TouchableOpacity
            onPress={handlePasteApiKey}
            className="p-2 ml-2 rounded-lg bg-primary"
          >
            <Text className="text-sm font-medium text-primary-content">
              Colar
            </Text>
          </TouchableOpacity>
        )}
      </View>
      <TouchableOpacity
        onPress={() =>
          Linking.openURL("https://aistudio.google.com/app/apikey")
        }
        className="mt-2"
      >
        <Text className="text-sm font-medium underline text-primary">
          Obtenha sua chave de API aqui
        </Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView className="flex-1 bg-background">
      <Header showConfig={false}
        back={config ? () => (
          <TouchableOpacity onPress={() => router.back()}
            className="rounded-lg"
            accessibilityRole="button"
            accessibilityLabel="Voltar"
          >
            <Entypo
              name="chevron-left"
              size={35}
              color={colors[theme].primary}
            />
          </TouchableOpacity>
        ) : undefined}
      />
      <ScrollView className="flex-1 px-4 py-6">
        <View className="space-y-6">
          <View>
            <Text className="mb-2 text-lg font-semibold text-background-content">
              Configuração de Horas de Trabalho
            </Text>
            <Text className="mb-4 text-sm font-medium text-background-content">
              {currentStep === 1 && "Passo 1: Horas de Trabalho"}
              {currentStep === 2 && "Passo 2: Detalhes da Empresa"}
              {currentStep === 3 && "Passo 3: Integrações"}
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
              </>
            )}

            {currentStep === 3 && <>{renderGeminiApiKeyInput()}</>}

            <View className="flex flex-row gap-x-4 justify-center mt-6">
              {currentStep > 1 && (
                <TouchableOpacity
                  className="p-3 w-28 rounded-lg border bg-tertiary border-primary"
                  onPress={prevStep}
                  accessibilityLabel="Voltar"
                  accessibilityRole="button"
                >
                  <Text className="font-medium text-center text-background-content">
                    Voltar
                  </Text>
                </TouchableOpacity>
              )}

              {currentStep < 3 && (
                <TouchableOpacity
                  className="p-3 w-28 rounded-lg bg-primary"
                  onPress={nextStep}
                  accessibilityLabel="Próximo"
                  accessibilityRole="button"
                >
                  <Text className="text-center text-primary-content">
                    Próximo
                  </Text>
                </TouchableOpacity>
              )}

              {currentStep === 3 && (
                <TouchableOpacity
                  className="p-3 w-28 rounded-lg bg-primary"
                  onPress={handleSaveConfig}
                  accessibilityLabel="Salvar configurações"
                  accessibilityRole="button"
                  disabled={loading}
                >
                  <Text className="text-center text-primary-content">
                    {loading ? "Salvando..." : "Salvar"}
                  </Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
