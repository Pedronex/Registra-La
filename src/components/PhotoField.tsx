import { useTheme } from "@/providers/ThemeProvider";
import { colors } from "@/utils/colorThemes";
import Entypo from "@react-native-vector-icons/entypo";
import { Image, Text, TouchableOpacity } from "react-native";

interface PhotoFieldProps {
	photo?: string | null;
	onPress: () => void;
}

/**
 * Foto do ponto: linha compacta quando vazia, miniatura quando há foto
 */
export function PhotoField({ photo, onPress }: PhotoFieldProps) {
	const { theme } = useTheme();

	if (photo) {
		return (
			<TouchableOpacity
				className="w-full h-40 rounded-2xl"
				onPress={onPress}
				accessibilityRole="button"
				accessibilityLabel="Foto do ponto. Toque para tirar outra"
			>
				<Image
					source={{ uri: `${photo}` }}
					className="w-full h-full rounded-2xl bg-surface"
					resizeMode="contain"
				/>
			</TouchableOpacity>
		);
	}

	return (
		<TouchableOpacity
			onPress={onPress}
			accessibilityRole="button"
			accessibilityLabel="Adicionar foto do ponto"
			className="flex-row justify-center items-center w-full h-14 rounded-2xl border bg-surface border-secondary"
		>
			<Entypo
				name="camera"
				size={22}
				color={colors[theme].accent}
				style={{ marginRight: 10 }}
			/>
			<Text className="font-semibold text-surface-content">Adicionar foto</Text>
		</TouchableOpacity>
	);
}
