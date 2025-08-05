import { Header } from "@/components/Header";
import { Link } from "expo-router";
import { Text, View } from "react-native";

export default function InitialPage() {

  return (
    <View className="justify-between items-center p-10 w-screen h-screen bg-neutral-100 dark:bg-gray-800">
      <View className="justify-center content-center items-center mt-10">
        <Header />
      </View>
      <View className="justify-center content-center items-center">
        <Link href="/config">
          <Text className="px-4 py-3 w-full text-white bg-blue-500 rounded-lg">Configurar</Text>
        </Link>
      </View>
      <View className="justify-center content-center items-center">
        {/* <Link href="/register">
          <Text className="px-4 py-3 w-full text-white bg-blue-500 rounded-lg">Registrar</Text>
        </Link> */}
      </View>
    </View>
  );
}
