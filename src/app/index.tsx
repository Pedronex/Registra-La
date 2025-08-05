import { Header } from "@/components/Header";
import { Link } from "expo-router";
import { Text, View } from "react-native";

export default function InitialPage() {

  return (
    <View className="justify-between items-center p-10 w-screen h-screen bg-neutral-100 dark:bg-gray-800">
      <View className="justify-center content-center items-center mt-10">
        <Header />
      </View>
      <View>
        <Text className="text-3xl text-black dark:text-white text-start">
          Gerencie sua jornada com simplicidade.
        </Text>
      </View>
      <Link href={'/config'} className="p-2 mt-5 w-full bg-blue-400 rounded-3xl dark:bg-blue-600">
        <Text className="text-3xl font-bold text-center text-black dark:text-white">
          Entrar
        </Text>
      </Link>
    </View>
  );
}
