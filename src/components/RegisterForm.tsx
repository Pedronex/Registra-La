import { RegisterInsert } from "@/db/schema/registers";
import { useTheme } from "@/providers/ThemeProvider";
import { colors } from "@/utils/colorThemes";
import { convertMinutesToTime, convertTimeToMinutes } from "@/utils/convert";
import { Text, TextInput, TouchableOpacity, View } from "react-native";
import { BalanceInput } from "./BalanceInput";
import { CollapsibleSection } from "./CollapsibleSection";
import { DateInput } from "./DateInput";
import { HourInput } from "./HourInput";
import { PhotoField } from "./PhotoField";

type FieldValue = string | Date | boolean | number;

interface RegisterFormProps {
	register: RegisterInsert;
	/** Tipos de registro disponíveis (ex.: trabalho, folga, atestado, saldo) */
	types: string[];
	onChange: (field: keyof RegisterInsert, value: FieldValue) => void;
	onTakePhoto: () => void;
	/** Jornada diária em horas (limita as horas de abono) */
	workHours?: number | null;
}

const LABEL_CLASS = "mb-1 text-sm font-medium text-background-content";

const parseDate = (date: string) =>
	new Date(`${date.split("/").reverse().join("-")}T00:00:00`);

/**
 * Formulário compartilhado de registro (novo e edição)
 */
export function RegisterForm({
	register,
	types,
	onChange,
	onTakePhoto,
	workHours,
}: RegisterFormProps) {
	const { theme } = useTheme();

	const dateField = (
		<View className="w-full">
			<Text className={LABEL_CLASS}>Data</Text>
			<DateInput
				mode="date"
				value={parseDate(register.date)}
				onChange={(value) =>
					onChange("date", value.toLocaleDateString("pt-BR"))
				}
			/>
		</View>
	);

	const typeChips = (
		<View className="w-full">
			<Text className={LABEL_CLASS}>Tipo de registro</Text>
			<View className="flex-row gap-x-2">
				{types.map((type) => (
					<TouchableOpacity
						key={type}
						className={`flex-1 items-center p-3 rounded-xl ${
							register.type === type ? "bg-primary" : "bg-surface"
						}`}
						onPress={() => onChange("type", type)}
						accessibilityRole="button"
						accessibilityState={{ selected: register.type === type }}
					>
						<Text
							className={`text-base font-medium ${
								register.type === type
									? "text-primary-content"
									: "text-surface-content"
							}`}
						>
							{type.charAt(0).toUpperCase() + type.slice(1)}
						</Text>
					</TouchableOpacity>
				))}
			</View>
		</View>
	);

	const renderByType = () => {
		switch (register.type) {
			case "trabalho":
				return (
					<>
						{dateField}
						<View className="w-full">
							<Text className={LABEL_CLASS}>Hora</Text>
							<HourInput
								onChange={(value) =>
									onChange("timeInMinutes", convertTimeToMinutes(value))
								}
								value={convertMinutesToTime(register.timeInMinutes || 0)}
							/>
						</View>
						<View className="w-full">
							<Text className={LABEL_CLASS}>Foto do ponto</Text>
							<PhotoField photo={register.photo} onPress={onTakePhoto} />
						</View>
						<CollapsibleSection
							title="Mais detalhes (NSR)"
							defaultOpen={!!register.nsr}
						>
							<TextInput
								value={register.nsr || ""}
								onChangeText={(value) => onChange("nsr", value)}
								className="px-4 h-12 rounded-xl bg-surface text-surface-content"
								placeholder="Digite o NSR (opcional)"
								placeholderTextColor={colors[theme].placeholder}
								accessibilityLabel="NSR"
							/>
						</CollapsibleSection>
					</>
				);
			case "saldo":
				return (
					<BalanceInput
						value={{
							hours: register.timeInMinutes
								? Math.floor(register.timeInMinutes / 60).toString()
								: "0",
							minutes: register.timeInMinutes
								? (register.timeInMinutes % 60).toString()
								: "0",
							date: parseDate(register.date),
							operation: register.isFullDay ? "increase" : "decrease",
						}}
						onChange={(hours, minutes, date, operation) => {
							onChange(
								"timeInMinutes",
								parseInt(hours) * 60 + parseInt(minutes),
							);
							onChange("date", date.toLocaleDateString("pt-BR"));
							onChange("isFullDay", operation === "increase");
						}}
					/>
				);
			default:
				return (
					<>
						{dateField}
						<View className="w-full">
							<Text className={LABEL_CLASS}>Tipo de abono</Text>
							<View className="flex-row gap-x-2 mb-3">
								{[
									{ label: "Dia todo", full: true },
									{ label: "Horas", full: false },
								].map(({ label, full }) => (
									<TouchableOpacity
										key={label}
										className={`flex-1 items-center p-3 rounded-xl ${
											register.isFullDay === full ? "bg-primary" : "bg-surface"
										}`}
										onPress={() => {
											onChange("isFullDay", full);
											onChange("timeInMinutes", full ? (workHours || 8) * 60 : 0);
										}}
										accessibilityRole="button"
										accessibilityState={{ selected: register.isFullDay === full }}
									>
										<Text
											className={`text-base font-medium ${
												register.isFullDay === full
													? "text-primary-content"
													: "text-surface-content"
											}`}
										>
											{label}
										</Text>
									</TouchableOpacity>
								))}
							</View>
							{!register.isFullDay && (
								<HourInput
									value={convertMinutesToTime(register.timeInMinutes || 0)}
									onChange={(value) =>
										onChange("timeInMinutes", convertTimeToMinutes(value))
									}
									max={
										workHours
											? `${String(workHours).padStart(2, "0")}:00`
											: "23:59"
									}
								/>
							)}
						</View>
						<View className="w-full">
							<Text className={LABEL_CLASS}>Descrição</Text>
							<TextInput
								value={register.location || ""}
								onChangeText={(value) => onChange("location", value)}
								className="p-3 rounded-xl bg-surface text-surface-content"
								placeholder="Digite a descrição"
								placeholderTextColor={colors[theme].placeholder}
								multiline
								numberOfLines={3}
							/>
						</View>
						<View className="w-full">
							<Text className={LABEL_CLASS}>Foto</Text>
							<PhotoField photo={register.photo} onPress={onTakePhoto} />
						</View>
					</>
				);
		}
	};

	return (
		<View className="gap-y-5 mt-2 w-full">
			{typeChips}
			{renderByType()}
		</View>
	);
}
