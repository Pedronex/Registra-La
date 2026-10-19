import { useTheme } from "@/providers/ThemeProvider";
import { colors } from "@/utils/colorThemes";
import Entypo from "@react-native-vector-icons/entypo";
import { useRouter } from "expo-router";
import { TouchableOpacity } from "react-native";

/**
 * Botão de voltar do cabeçalho
 */
export function BackButton() {
	const router = useRouter();
	const { theme } = useTheme();

	return (
		<TouchableOpacity
			onPress={() => router.back()}
			accessibilityRole="button"
			accessibilityLabel="Voltar"
			className="justify-center items-center w-12 h-12 rounded-full"
		>
			<Entypo name="chevron-left" size={30} color={colors[theme].accent} />
		</TouchableOpacity>
	);
}
