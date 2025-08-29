import * as ImagePicker from "expo-image-picker";
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
import { database } from "@/db";
import { RegisterInsert, registersTable } from "@/db/schema";
import { useConfig } from "@/hooks/useConfig";
import { useTheme } from "@/providers/ThemeProvider";
import { router } from "expo-router";
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
  const [loading, setLoading] = useState(false);

  const { config } = useConfig();
  const { theme } = useTheme();

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

      if (config.geminiApiKey && config.geminiApiKey.length > 0) {
        setLoading(true);
        const response = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${config.geminiApiKey}`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              contents: [
                {
                  role: "user",
                  parts: [
                    {
                      inlineData: {
                        mimeType: "image/jpeg",
                        data: result.assets[0].base64,
                      },
                    },
                  ],
                },
              ],
              generationConfig: {
                temperature: 0.1,
                maxOutputTokens: 1024,
                thinkingConfig: {
                  thinkingBudget: 0,
                },
                responseMimeType: "application/json",
                responseSchema: {
                  type: "object",
                  properties: {
                    date: { type: "string" },
                    time: { type: "string" },
                    nsr: { type: "string" },
                  },
                  required: ["date", "time", "nsr"],
                  propertyOrdering: ["date", "time", "nsr"],
                },
              },
            }),
          }
        );
        console.log(response);

        const data = await response.json();
        const { date, time, nsr } = JSON.parse(
          data.candidates[0].content.parts[0].text
        ) as {
          date: string;
          time: string;
          nsr: string;
        };

        setRegister((prev) => ({
          ...prev,
          date: date,
          time: time,
          nsr: nsr,
        }));
        setLoading(false);
      }
    }
    return;
  };

  const handleInputChange = (
    field: keyof typeof register,
    value: string | Date
  ) => {
    setRegister((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  async function handleRegister() {
    const [result] = await database
      .insert(registersTable)
      .values(register)
      .returning();
    console.log(result);
    router.back();
    return result;
  }

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center p-6 bg-background">
        <ActivityIndicator size="large" className="mb-3" color="#000" />
        <Text className="text-lg font-medium text-background-content">
          Processando dados da foto...
        </Text>
      </View>
    );
  }

  return (
    <SafeAreaView className="flex-1 justify-between items-center px-3 pb-5 bg-background">
      <Header />

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
            value={register.time}
          />
        </View>

        {register.photo ? (
          <TouchableOpacity
            className="items-center p-3 w-full h-48 rounded-lg"
            onPress={handleTakePhoto}
          >
            <Image
              source={{ uri: `${register.photo}` }}
              className="w-full h-full rounded-lg"
              resizeMode="cover"
              width={500}
              height={500}
            />
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            onPress={handleTakePhoto}
            className="justify-center items-center p-3 w-full h-48 rounded-lg bg-tertiary"
          >
            <Text className="text-lg font-medium text-tertiary-content">
              Foto do Ponto
            </Text>
          </TouchableOpacity>
        )}

        <View className="w-full">
          <Text className="mb-1 text-lg font-medium text-background-content">
            NSR
          </Text>
          <TextInput
            value={register.nsr || ""}
            onChangeText={(value) => handleInputChange("nsr", value)}
            className="p-2 rounded-md bg-tertiary text-tertiary-content"
            placeholder="Digite o NSR"
            placeholderTextColor={theme === 'light'? '#FFFFFF' : '#492532'}
          />
        </View>
      </View>

      <TouchableOpacity
        className="items-center p-4 mt-6 w-full rounded-lg bg-success"
        onPress={handleRegister}
      >
        <Text className="text-lg font-bold text-success-content">
          Registrar
        </Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}
