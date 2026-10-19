import { useTheme } from "@/providers/ThemeProvider";
import { colors } from "@/utils/colorThemes";
import { convertMinutesToTime } from "@/utils/convert";
import { DateTimePickerAndroid } from "@react-native-community/datetimepicker";
import Entypo from "@react-native-vector-icons/entypo";
import { Text, TouchableOpacity, View } from "react-native";

interface TimeFieldProps {
	label: string;
	/** Horário em minutos desde 00:00 */
	minutes: number;
	onChange: (minutes: number) => void;
}

/**
 * Campo de horário que abre o seletor nativo (24h) ao tocar
 */
export function TimeField({ label, minutes, onChange }: TimeFieldProps) {
	const { theme } = useTheme();
	const time = convertMinutesToTime(minutes);

	const openPicker = () => {
		DateTimePickerAndroid.open({
			value: new Date(2000, 0, 1, Math.floor(minutes / 60), minutes % 60),
			mode: "time",
			is24Hour: true,
			onChange: (event, selected) => {
				if (event.type === "set" && selected) {
					onChange(selected.getHours() * 60 + selected.getMinutes());
				}
			},
		});
	};

	return (
		<View className="flex-1">
			<Text className="mb-1 text-sm font-medium text-background-content">
				{label}
			</Text>
			<TouchableOpacity
				onPress={openPicker}
				accessibilityRole="button"
				accessibilityLabel={`${label}: ${time}`}
				accessibilityHint="Toque para escolher o horário"
				className="flex-row justify-between items-center px-4 h-14 rounded-xl border bg-surface border-surface-content"
			>
				<Text className="text-xl font-semibold text-surface-content">
					{time}
				</Text>
				<Entypo name="clock" size={20} color={colors[theme].accent} />
			</TouchableOpacity>
		</View>
	);
}
