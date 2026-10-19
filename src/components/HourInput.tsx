import { useTheme } from "@/providers/ThemeProvider";
import { colors } from "@/utils/colorThemes";
import { DateTimePickerAndroid } from "@react-native-community/datetimepicker";
import Entypo from "@react-native-vector-icons/entypo";
import { Text, TouchableOpacity, View } from "react-native";

interface HourInputProps {
	onChange: (hour: string) => void;
	/** Horário no formato HH:MM */
	value: string;
	min?: string;
	max?: string;
}

const pad = (n: number) => n.toString().padStart(2, "0");

/**
 * Seletor de horário: toque no horário abre o seletor nativo (24h);
 * `−`/`+` ajustam 1 minuto (toque longo ajusta 15).
 */
export function HourInput({
	onChange,
	value,
	min = "00:00",
	max = "23:59",
}: HourInputProps) {
	const { theme } = useTheme();
	const [hours, minutes] = value.split(":").map((part) => Number(part) || 0);
	const current = hours * 60 + minutes;

	const clamp = (time: string) => (time > max ? max : time < min ? min : time);

	const change = (time: string) => onChange(clamp(time));

	const step = (delta: number) => {
		const total = (((current + delta) % 1440) + 1440) % 1440;
		change(`${pad(Math.floor(total / 60))}:${pad(total % 60)}`);
	};

	const openPicker = () => {
		DateTimePickerAndroid.open({
			value: new Date(2000, 0, 1, hours, minutes),
			mode: "time",
			is24Hour: true,
			onChange: (event, selected) => {
				if (event.type === "set" && selected) {
					change(`${pad(selected.getHours())}:${pad(selected.getMinutes())}`);
				}
			},
		});
	};

	return (
		<View className="flex-row gap-x-4 justify-between items-center p-2 w-full rounded-2xl bg-surface elevation">
			<TouchableOpacity
				className="justify-center items-center w-12 h-12 rounded-full border bg-tertiary border-accent"
				onPress={() => step(-1)}
				onLongPress={() => step(-15)}
				accessibilityRole="button"
				accessibilityLabel="Diminuir minutos"
				accessibilityHint="Toque longo diminui 15 minutos"
			>
				<Entypo name="minus" size={26} color={colors[theme].surfaceContent} />
			</TouchableOpacity>
			<TouchableOpacity
				className="flex-1 items-center py-2 rounded-xl"
				onPress={openPicker}
				accessibilityRole="button"
				accessibilityLabel={`Hora: ${value}`}
				accessibilityHint="Toque para escolher o horário"
			>
				<Text className="text-5xl font-semibold text-surface-content">
					{`${pad(hours)}:${pad(minutes)}`}
				</Text>
			</TouchableOpacity>
			<TouchableOpacity
				className="justify-center items-center w-12 h-12 rounded-full border bg-tertiary border-accent"
				onPress={() => step(1)}
				onLongPress={() => step(15)}
				accessibilityRole="button"
				accessibilityLabel="Aumentar minutos"
				accessibilityHint="Toque longo aumenta 15 minutos"
			>
				<Entypo name="plus" size={26} color={colors[theme].surfaceContent} />
			</TouchableOpacity>
		</View>
	);
}
