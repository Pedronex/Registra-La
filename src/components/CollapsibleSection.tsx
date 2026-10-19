import { useTheme } from "@/providers/ThemeProvider";
import { colors } from "@/utils/colorThemes";
import Entypo from "@react-native-vector-icons/entypo";
import { type ReactNode, useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";

interface CollapsibleSectionProps {
	title: string;
	/** Abre automaticamente (ex.: há conteúdo preenchido) até o usuário alternar */
	defaultOpen?: boolean;
	children: ReactNode;
}

/**
 * Seção recolhível para campos opcionais
 */
export function CollapsibleSection({
	title,
	defaultOpen = false,
	children,
}: CollapsibleSectionProps) {
	const { theme } = useTheme();
	const [userOpen, setUserOpen] = useState<boolean | null>(null);
	const open = userOpen ?? defaultOpen;

	return (
		<View className="w-full">
			<TouchableOpacity
				onPress={() => setUserOpen(!open)}
				accessibilityRole="button"
				accessibilityState={{ expanded: open }}
				accessibilityLabel={title}
				className="flex-row justify-between items-center h-12"
			>
				<Text className="text-sm font-medium text-background-content">
					{title}
				</Text>
				<Entypo
					name={open ? "chevron-up" : "chevron-down"}
					size={22}
					color={colors[theme].accent}
				/>
			</TouchableOpacity>
			{open && <View className="gap-y-3">{children}</View>}
		</View>
	);
}
