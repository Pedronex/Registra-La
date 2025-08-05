import { database } from "@/db";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { ScrollView, Text, TextInput, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function ConfigPage() {
  const [workHours, setWorkHours] = useState(0);
  const [tolerance, setTolerance] = useState(0);
  const router = useRouter();

  const saveConfig = async () => {
    try {
      await database.localStorage.set("Register", {
        workHours,
        tolerance,
      });
      router.push("/home");

    } catch (error) {
      console.error("Erro ao salvar a configuração: " + (error as Error).message);
      console.error(error);
    }
  }


  return (
    <SafeAreaView className="flex-1 bg-neutral-100 dark:bg-gray-800">
      <ScrollView className="flex-1 px-4 py-6">
        <View className="space-y-6">
          <View>
            <Text className="mb-2 text-lg font-semibold text-gray-800 dark:text-white">
              Configuração de Horas de Trabalho
            </Text>
            <Text className="mb-4 text-sm text-gray-600 dark:text-gray-200">
              Por favor, insira suas horas de trabalho diárias e tempo de tolerância
            </Text>
          </View>

          <View className="flex flex-col gap-y-4">

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
              />
            </View>

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
              />
            </View>

            <TouchableOpacity
              className="p-3 w-full bg-blue-500 rounded-lg"
              onPress={saveConfig}
            >
              <Text className="text-center text-white">Salvar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
