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
	/**
	 * Mostra o logo do app (apenas na tela de boas-vindas); nas telas internas
	 * o espaço do logo fica vazio para ganhar área útil.
	 */
	showLogo?: boolean;
	back?: () => React.ReactNode;
	/** Ação à direita (ex.: excluir); substitui o botão de configurações */
	right?: () => React.ReactNode;
}

/**
 * Componente de cabeçalho do aplicativo
 * Exibe o título e, opcionalmente, o logo, o botão de voltar e o de configurações
 */
export function Header({
	title = "Registra Lá",
	showConfig = true,
	showLogo = false,
	back,
	right,
}: HeaderProps) {
	const logoDark = require("@/assets/Relogio.png");
	const { theme } = useTheme();
	const { updateAvailable } = useUpdate();

	const titleClass = showLogo
		? "text-4xl font-medium text-surface-content"
		: "text-2xl font-semibold text-surface-content";

	// Elemento da esquerda: voltar, logo ou espaçador (mantém o título centralizado)
	const leftSlot = back ? (
		back()
	) : showLogo ? (
		<View
			className={`p-2 w-14 h-14 rounded-2xl ${theme === "dark" ? "" : "bg-primary"}`}
		>
			<Image
				source={logoDark}
				className="w-full h-full"
				accessibilityLabel="Logo do aplicativo"
			/>
		</View>
	) : (
		<View className="w-12 h-12" />
	);

	const rightSlot = right ? (
		right()
	) : showConfig && !back ? (
			<Link href="/config" asChild>
				<TouchableOpacity
					className="justify-center items-center w-12 h-12 rounded-full"
					accessibilityRole="button"
					accessibilityLabel="Configurar aplicativo"
				>
					<Entypo name="cog" size={28} color={colors[theme].accent} />
				</TouchableOpacity>
			</Link>
		) : (
			<View className="w-12 h-12" />
		);

	return (
		<>
			<View className="flex-row justify-between items-center px-2 w-full">
				{leftSlot}
				<Text className={titleClass} accessibilityRole="header">
					{title}
				</Text>
				{rightSlot}
			</View>
			{updateAvailable && !back && <UpdateAlert />}
		</>
	);
}
