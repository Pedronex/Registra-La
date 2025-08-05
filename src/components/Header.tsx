import { Image, Text, View } from "react-native";

export function Header() {
    return (
        <View className="flex-row justify-center items-center">
            <Image source={require("@/assets/Relogio.png")} width={50} height={50} className="mr-2"/>
            <Text className="text-4xl dark:text-white">Registra lá</Text>
        </View>
    )
}