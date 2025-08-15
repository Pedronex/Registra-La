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
      setRegister({
        ...register,
        photo: result.assets[0].uri,
      });

      setLoading(true);
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${"AIzaSyAiiMTpVHChK7Jh1gh_3ZULJB2_RIhtBpg"}`,
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

  async function handleRegister() {
    const [result] = await database
      .insert(registersTable)
      .values(register)
      .returning();
    console.log(result)
    return result;
  }

  if (loading) {
    return (
      <View
        className="justify-center items-center p-6 w-screen h-screen bg-neutral-100 dark:bg-gray-800"
        style={{ backgroundColor }}
      >
        <ActivityIndicator size="large" color={textColor} className="mb-3" />
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

      <View className="flex flex-col justify-between items-center space-y-4 w-full h-3/4">
        <View className="w-full">
          <Text
            style={{ color: textColor }}
            className="mb-1 text-lg font-medium"
          >
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
          <Text
            style={{ color: textColor }}
            className="mb-1 text-lg font-medium"
          >
            Hora
          </Text>
          <HourInput
            onChange={(value) => handleInputChange("time", value)}
            value={register.time}
          />
        </View>

        {register.photo ? (
          <TouchableOpacity
            className="items-center p-3 w-full h-1/2 rounded-lg"
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
            className="items-center p-3 w-full h-1/2 bg-blue-500 rounded-lg"
          >
            <Text style={{ color: textColor }} className="text-lg font-medium">
              Foto do Ponto
            </Text>
          </TouchableOpacity>
        )}

        <View className="w-full">
          <Text
            style={{ color: textColor }}
            className="mb-1 text-lg font-medium"
          >
            NSR
          </Text>
          <TextInput
            value={register.nsr || ""}
            onChangeText={(value) => handleInputChange("nsr", value)}
            className="p-2 text-black bg-gray-200 rounded-md"
            placeholder="Digite o NSR"
          />
        </View>
      </View>

      <TouchableOpacity
        className="items-center p-4 mt-6 w-full bg-green-500 rounded-lg"
        onPress={handleRegister}
      >
        <Text className="text-lg font-bold text-white">Registrar</Text>
      </TouchableOpacity>
    </View>
  );
}
