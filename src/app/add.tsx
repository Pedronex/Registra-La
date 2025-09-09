import * as ImagePicker from "expo-image-picker";
import { router } from "expo-router";
import { useState } from "react";
import {
  ActivityIndicator,
  Image,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import { DateInput } from "@/components/DateInput";
import { Header } from "@/components/Header";
import { HourInput } from "@/components/HourInput";
import { RegisterInsert } from "@/db/schema";
import { useConfig } from "@/hooks/useConfig";
import { useRegister } from "@/hooks/useRegister";
import { useTheme } from "@/providers/ThemeProvider";
import { colors } from "@/utils/colorThemes";
import { Entypo } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";

/**
 * Página de registro de ponto
 * Permite o usuário registrar o seu ponto
 */
export default function RegisterPage() {
  const [register, setRegister] = useState<RegisterInsert>({
    date: new Date().toLocaleDateString("pt-BR"),
    time: new Date().toLocaleTimeString("pt-BR", {
      hour: "2-digit",
      minute: "2-digit",
    }),
    type: "trabalho",
    nsr: "",
    location: "",
    photo: "",
    isFullDay: false,
  });

  const { config } = useConfig();
  const { theme } = useTheme();
  const { saveRegister, extractDataPhoto, loading } = useRegister();

  const handleTakePhoto = async () => {
    if (!config) {
      return;
    }
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== "granted") {
      alert("Permissão de câmera negada!");
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: "images",
      allowsEditing: false,
      aspect: [4, 3],
      quality: 1,
      base64: true,
    });

    if (!result.canceled || result.assets) {
      const formData = new FormData();
      formData.append("file", {
        uri: result.assets[0].uri,
        type: "image/jpeg",
        name: "photo.jpg",
      } as unknown as File);
      setRegister({
        ...register,
        photo: result.assets[0].uri,
      });
      if (
        register.type === "trabalho" &&
        config.geminiApiKey &&
        config.geminiApiKey.length > 0
      ) {
        const { date, time, nsr } = await extractDataPhoto(
          result.assets[0].base64 || "",
          config.geminiApiKey
        );

        setRegister((prev) => ({
          ...prev,
          date: date,
          time: time,
          nsr: nsr,
        }));
      }
    }
    return;
  };

  const handleInputChange = (
    field: keyof typeof register,
    value: string | Date | boolean | number
  ) => {
    setRegister((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  async function handleRegister() {
    const result = await saveRegister(register);
    if (result) {
      router.push("/(tabs)/");
    }
  }

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center p-6 bg-background">
        <ActivityIndicator
          size="large"
          className="mb-3"
          color={colors[theme].backgroundColor}
        />
        <Text className="text-lg font-medium text-background-content">
          Processando dados da foto...
        </Text>
      </View>
    );
  }

  console.log(config?.workHours)

  function renderRegisterForm() {
    switch (register.type) {
      case "trabalho":
        return (
          <View className="flex-1 gap-y-5 mt-4 space-y-4 w-full">
            <View className="w-full">
              <Text className="mb-1 text-lg font-medium text-background-content">
                Data
              </Text>
              <DateInput
                mode="date"
                value={
                  new Date(
                    register.date.split("/").reverse().join("-") + "T00:00:00"
                  )
                }
                onChange={(value) =>
                  handleInputChange("date", value.toLocaleDateString("pt-BR"))
                }
              />
            </View>

            <View className="w-full">
              <Text className="mb-1 text-lg font-medium text-background-content">
                Hora
              </Text>
              <HourInput
                onChange={(value) => handleInputChange("time", value)}
                value={register.time || "00:00"}
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
                  <Entypo
                    name="camera"
                    size={50}
                    color={colors[theme].surfaceContent}
                  />
                </TouchableOpacity>
              )}
            </View>

            <View className="w-full">
              <Text className="mb-1 text-lg font-medium text-background-content">
                NSR
              </Text>
              <TextInput
                value={register.nsr || ""}
                onChangeText={(value) => handleInputChange("nsr", value)}
                className="p-2 rounded-md bg-surface text-surface-content"
                placeholder="Digite o NSR (Opcional)"
                placeholderTextColor={colors[theme].surfaceContent + "60"}
              />
            </View>
          </View>
        );
      default:
        return (
          <View className="flex-1 gap-y-5 mt-4 space-y-4 w-full">
            <View className="w-full">
              <Text className="mb-1 text-lg font-medium text-background-content">
                Data
              </Text>
              <DateInput
                mode="date"
                value={
                  new Date(
                    register.date.split("/").reverse().join("-") + "T00:00:00"
                  )
                }
                onChange={(value) =>
                  handleInputChange("date", value.toLocaleDateString("pt-BR"))
                }
              />
            </View>
            <View className="w-full">
              <Text className="mb-1 text-lg font-medium text-background-content">
                Tipo de Abono
              </Text>
              <View className="flex-row gap-x-2 mb-4">
                <TouchableOpacity
                  className={`flex-1 items-center p-3 rounded-lg ${
                    register.isFullDay ? "bg-primary" : "bg-surface"
                  }`}
                  onPress={() => {
                    handleInputChange("isFullDay", true);
                    handleInputChange(
                      "time",
                      `${config?.workHours || "08"}:00`
                    );
                  }}
                >
                  <Text
                    className={`text-base font-medium ${
                      register.isFullDay
                        ? "text-primary-content"
                        : "text-surface-content"
                    }`}
                  >
                    Dia Todo
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  className={`flex-1 items-center p-3 rounded-lg ${
                    !register.isFullDay ? "bg-primary" : "bg-surface"
                  }`}
                  onPress={() => {
                    handleInputChange("isFullDay", false);
                    handleInputChange("time", "00:00");
                  }}
                >
                  <Text
                    className={`text-base font-medium ${
                      !register.isFullDay
                        ? "text-primary-content"
                        : "text-surface-content"
                    }`}
                  >
                    Horas
                  </Text>
                </TouchableOpacity>
              </View>
              {!register.isFullDay && (
                <HourInput
                  value={register.time?.toString() || "00:00"}
                  onChange={(value) => handleInputChange("time", value)}
                  max={
                    `${
                      String(config?.workHours).padStart(2, "0") || "09"
                    }:00` || "23:59"
                  }
                />
              )}
            </View>

            <View className="w-full">
              <Text className="mb-1 text-lg font-medium text-background-content">
                Descrição
              </Text>
              <TextInput
                value={register.location || ""}
                onChangeText={(value) => handleInputChange("location", value)}
                className="p-2 rounded-md bg-surface text-surface-content"
                placeholder="Digite a descrição do atestado"
                placeholderTextColor={colors[theme].surfaceContent + "60"}
                multiline
                numberOfLines={3}
              />
            </View>

            <View className="w-full">
              <Text className="mb-1 text-lg font-medium text-background-content">
                Foto do Atestado
              </Text>
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
                  <Entypo
                    name="camera"
                    size={50}
                    color={colors[theme].surfaceContent}
                  />
                </TouchableOpacity>
              )}
            </View>
          </View>
        );
    }
  }

  function renderTypesForm() {
    const types = ["trabalho", "folga", "atestado"];

    return (
      <View className="w-full">
        <Text className="mb-1 text-lg font-medium text-background-content">
          Tipo de Registro
        </Text>
        <View className="flex-row gap-x-2">
          {types.map((type) => (
            <TouchableOpacity
              key={type}
              className={`flex-1 items-center p-3 rounded-lg ${
                register.type === type ? "bg-primary" : "bg-surface"
              }`}
              onPress={() => handleInputChange("type", type)}
            >
              <Text
                className={`text-base font-medium ${
                  register.type === type
                    ? "text-primary-content"
                    : "text-surface-content"
                }`}
              >
                {type.charAt(0).toUpperCase() + type.slice(1)}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    );
  }

  function renderFooter() {
    return (
      <View className="flex-row gap-x-2 w-full">
        <TouchableOpacity
          className="flex-1 items-center p-4 mt-6 rounded-lg bg-error"
          onPress={() => router.push("/(tabs)/")}
        >
          <Text className="text-lg font-bold text-error-content">Voltar</Text>
        </TouchableOpacity>

        <TouchableOpacity
          className="flex-1 items-center p-4 mt-6 rounded-lg bg-success"
          onPress={handleRegister}
          disabled={loading}
        >
          <Text className="text-lg font-bold text-success-content">
            {loading ? "Salvando..." : "Registrar"}
          </Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <SafeAreaView className="flex-1 justify-between items-center px-3 pb-5 bg-background">
      <Header />
      {renderTypesForm()}
      {renderRegisterForm()}
      {renderFooter()}
    </SafeAreaView>
  );
}
