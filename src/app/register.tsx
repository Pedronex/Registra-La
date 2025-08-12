import { useThemeColor } from "@/hooks/useThemeColor";
import * as ImagePicker from "expo-image-picker";
import { useState } from "react";
import { ActivityIndicator, Text, TouchableOpacity, View } from "react-native";

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
    date: "",
    time: "",
    nsr: "",
    location: "",
    photo: "",
  });
  const [loading, setLoading] = useState(false);

  const handleTakePhoto = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== "granted") {
      alert("Sorry, we need camera permissions to make this work!");
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: "images",
      allowsEditing: false,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled || result.assets) {
      const formData = new FormData();
      formData.append("file", {
        uri: result.assets[0].uri,
        type: "image/jpeg",
        name: "photo.jpg",
      } as unknown as File);

      setLoading(true);
      console.log();
      const response = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/ocr`, {
        method: "POST",
        headers: { "Content-Type": "multipart/form-data" },
        body: formData,
      });
      const data = await response.json();
      console.log(data);
      setRegister({
        photo: result.assets[0].uri,
        date: data.date,
        time: data.hour,
        nsr: data.nsr,
        location: data.location,
      });
      setLoading(false);

      return;
    }
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
      <View className="space-y-2">
        <Text style={{ color: textColor }} className="text-lg font-medium">
          Photo
        </Text>
        <TouchableOpacity
          onPress={handleTakePhoto}
          className="items-center p-3 bg-blue-500 rounded-lg"
        >
          <Text className="font-medium text-white">Foto</Text>
        </TouchableOpacity>
      </View>

      {register && (
        <View className="flex flex-col items-center">
          <Text style={{ color: textColor }} className="text-lg font-medium">
            Data
          </Text>
          <Text style={{ color: textColor }} className="text-lg font-medium">
            {register.date}
          </Text>
          <Text style={{ color: textColor }} className="text-lg font-medium">
            Hora
          </Text>
          <Text style={{ color: textColor }} className="text-lg font-medium">
            {register.time}
          </Text>
          <Text style={{ color: textColor }} className="text-lg font-medium">
            NSR
          </Text>
          <Text style={{ color: textColor }} className="text-lg font-medium">
            {register.nsr}
          </Text>
          <Text style={{ color: textColor }} className="text-lg font-medium">
            Local
          </Text>
          <Text style={{ color: textColor }} className="text-lg font-medium">
            {register.location}
          </Text>
        </View>
      )}

      <TouchableOpacity
        className="items-center p-4 mt-6 bg-green-500 rounded-lg"
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
