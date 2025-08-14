import * as ImagePicker from "expo-image-picker";
import { useState } from "react";
import {
  ActivityIndicator,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import { DateInput } from "@/components/DateInput";
import { Header } from "@/components/Header";
import { useThemeColor } from "@/hooks/useThemeColor";

/**
 * Página de registro de ponto
 * Permite o usuário registrar o seu ponto
 */
export default function RegisterPage() {
  const backgroundColor = useThemeColor(
    { light: "#F5F5F5", dark: "#1F2937" },
    "background"
  );
  const textColor = useThemeColor(
    { light: "#1F2937", dark: "#F5F5F5" },
    "text"
  );
  const [register, setRegister] = useState({
    date: new Date(),
    time: new Date(),
    nsr: "",
    location: "",
    photo: "",
  });
  const [loading, setLoading] = useState(false);

  const handleTakePhoto = async () => {
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

      setLoading(true);
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:streamGenerateContent?key=${'CHAVE_API'}`,
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
                  hour: { type: "string" },
                  nsr: { type: "string" },
                },
                required: ["date", "hour", "nsr"],
                propertyOrdering: ["date", "hour", "nsr"],
              },
            },
          }),
        }
      );
      const data = await response.json();
      console.log(data.candidates[0].content.parts[0].text);
      const json = JSON.parse(data.candidates[0].content.parts[0].text);
      console.log(json);




      console.log(data);
      setRegister({
        photo: result.assets[0].uri,
        date: data.date || "",
        time: data.hour || "",
        nsr: data.nsr || "",
        location: data.location || "",
      });
      setLoading(false);

      return;
    }
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

  if (loading) {
    return (
      <View
        className="justify-between items-center p-6 w-screen h-screen bg-neutral-100 dark:bg-gray-800"
        style={{ backgroundColor }}
      >
        <ActivityIndicator size="large" color={textColor} />
        <Text style={{ color: textColor }} className="text-lg font-medium">
          Processando dados da foto...
        </Text>
      </View>
    );
  }

  return (
    <View
      className="justify-between items-center p-6 w-screen h-screen bg-neutral-100 dark:bg-gray-800"
      style={{ backgroundColor }}
    >
      <Header />

      <View className="flex flex-col items-center space-y-4 w-full">
        <View className="w-full">
          <Text
            style={{ color: textColor }}
            className="mb-1 text-lg font-medium"
          >
            Data
          </Text>
          <DateInput
            mode="date"
            value={register.date}
            onChange={(value) => handleInputChange("date", value)}
          />
        </View>

        <View className="w-full">
          <Text
            style={{ color: textColor }}
            className="mb-1 text-lg font-medium"
          >
            Hora
          </Text>
          <DateInput
            mode="time"
            value={register.time}
            onChange={(value) => handleInputChange("time", value)}
          />
        </View>

        <View className="w-full">
          <Text
            style={{ color: textColor }}
            className="mb-1 text-lg font-medium"
          >
            NSR
          </Text>
          <TextInput
            value={register.nsr}
            onChangeText={(value) => handleInputChange("nsr", value)}
            style={{ color: textColor, borderColor: textColor }}
            className="p-2 bg-gray-200 rounded-md"
            placeholder="Digite o NSR"
          />
        </View>

        <View className="w-full">
          <Text
            style={{ color: textColor }}
            className="mb-1 text-lg font-medium"
          >
            Local
          </Text>
          <TextInput
            value={register.location}
            onChangeText={(value) => handleInputChange("location", value)}
            style={{ color: textColor, borderColor: textColor }}
            className="p-2 bg-gray-200 rounded-md"
            placeholder="Digite o local"
          />
        </View>
      </View>
      <TouchableOpacity
        onPress={handleTakePhoto}
        className="items-center p-3 bg-blue-500 rounded-lg"
      >
        <Text style={{ color: textColor }} className="text-lg font-medium">
          Foto do Ponto
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        className="items-center p-4 mt-6 w-full bg-green-500 rounded-lg"
        onPress={() => {
          // Handle registration submission
          console.log(register);
        }}
      >
        <Text className="text-lg font-bold text-white">Registrar</Text>
      </TouchableOpacity>
    </View>
  );
}
