import { useUpdate } from "@/hooks/useUpdate";
import { useTheme } from "@/providers/ThemeProvider";
import { colors } from "@/utils/colorThemes";
import Entypo from "@react-native-vector-icons/entypo";
import { Link } from "expo-router";
import { Image, Text, TouchableOpacity, View } from "react-native";
import { UpdateAlert } from "./UpdateAlert";

/**
 * Interface de propriedades do componente Header
 */
interface HeaderProps {
	/**
	 * Título opcional para o cabeçalho
	 */
	title?: string;
	/**
	 * Se deve mostrar o botão de configuração
	 */
	showConfig?: boolean;
	back?: () => React.ReactNode;
}

/**
 * Componente de cabeçalho do aplicativo
 * Exibe o logo e o título do aplicativo
 */
export function Header({
	title = "Registra Lá",
	showConfig = true,
	back,
}: HeaderProps) {
	const logoDark = require("@/assets/Relogio.png");
	const { theme } = useTheme();
	const { updateAvailable } = useUpdate();

	const logo = (
		<View
			className={`p-2 w-14 h-14 rounded-2xl ${theme === "dark" ? "" : "bg-primary"}`}
		>
			<Image
				source={logoDark}
				className="w-full h-full"
				accessibilityLabel="Logo do aplicativo"
			/>
		</View>
	);

	const actionButtons = (
		<View className="flex-row gap-4">
			{showConfig && (
				<Link href="/config" asChild>
					<TouchableOpacity
						className="p-2 rounded-lg"
						accessibilityRole="button"
						accessibilityLabel="Configurar aplicativo"
					>
						<Entypo name="cog" size={35} color={colors[theme].accent} />
					</TouchableOpacity>
				</Link>
			)}
		</View>
	);

	if (back) {
		return (
			<View className="flex-row justify-between items-center px-6 w-screen">
				{back()}
				<Text
					className="text-4xl font-medium text-surface-content"
					accessibilityRole="header"
				>
					{title}
				</Text>
				{logo}
			</View>
		);
	}

	return (
		<>
			<View
				className={`flex-row items-center px-6 w-screen ${
					showConfig ? "justify-between" : "justify-center"
				}`}
			>
				{logo}
				<Text
					className="text-4xl font-medium text-surface-content"
					accessibilityRole="header"
				>
					{title}
				</Text>
				{actionButtons}
			</View>
			{updateAvailable && <UpdateAlert />}
		</>
	);
}
