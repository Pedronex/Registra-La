import { useTheme } from "@/providers/ThemeProvider";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { colors } from "@/utils/colorThemes";
import Entypo from "@react-native-vector-icons/entypo";
import { Text, TouchableOpacity, View } from "react-native";

interface MonthNavigatorProps {
	date: Date;
	onChangeMonth: (amount: number) => void;
}

export function MonthNavigator({ date, onChangeMonth }: MonthNavigatorProps) {
	const { theme } = useTheme();

	const rawLabel = format(date, "MMMM yyyy", { locale: ptBR });
	const monthLabel = rawLabel.charAt(0).toUpperCase() + rawLabel.slice(1);

	return (
		<View className="flex-row justify-between items-center mb-4">
			<TouchableOpacity
				onPress={() => onChangeMonth(-1)}
				hitSlop={12}
				accessibilityRole="button"
				accessibilityLabel="Mês anterior"
			>
				<Entypo
					name="chevron-left"
					size={30}
					color={colors[theme].backgroundColor}
				/>
			</TouchableOpacity>
			<Text
				className="text-xl text-background-content"
				accessibilityRole="header"
			>
				{monthLabel}
			</Text>
			<TouchableOpacity
				onPress={() => onChangeMonth(1)}
				hitSlop={12}
				accessibilityRole="button"
				accessibilityLabel="Próximo mês"
			>
				<Entypo
					name="chevron-right"
					size={30}
					color={colors[theme].backgroundColor}
				/>
			</TouchableOpacity>
		</View>
	);
}
