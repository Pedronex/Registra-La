import { RegisterData } from "@/db/schema/registers";
import { Alert } from "@/lib/Alert";
import { useConfig } from "@/hooks/useConfig";
import { useRegister } from "@/hooks/useRegister";
import { useTimeRecords } from "@/hooks/useTimeRecords";
import { useTheme } from "@/providers/ThemeProvider";
import { colors } from "@/utils/colorThemes";
import { convertMinutesToTime, convertTimeToMinutes } from "@/utils/convert";
import Entypo from "@react-native-vector-icons/entypo";
import Octicons from "@react-native-vector-icons/octicons";
import { DateTimePickerAndroid } from "@react-native-community/datetimepicker";
import { addDays, format, isToday, subDays } from "date-fns";
import { ptBR } from "date-fns/locale";
import * as ImagePicker from "expo-image-picker";
import { LinearGradient } from "expo-linear-gradient";
import { Link } from "expo-router";
import { useEffect, useMemo, useState } from "react";
import {
	ActivityIndicator,
	ScrollView,
	Text,
	TouchableOpacity,
	View,
} from "react-native";
import { Balance } from "./Balance";
import { Loading } from "./Loading";
import { UndoBar } from "./UndoBar";
import { Record } from "./Record";

/**
 * Componente que exibe o histórico de registros de ponto
 */
type HistoryProps = {
	date?: Date;
	onDateChange?: (date: Date) => void;
};

export function History({
	date: controlledDate,
	onDateChange,
}: HistoryProps = {}) {
	// Estados
	const [internalDate, setInternalDate] = useState(new Date());
	const date = controlledDate ?? internalDate;
	const setDate = onDateChange ?? setInternalDate;
	const [lastPunch, setLastPunch] = useState<{
		id: number;
		message: string;
	} | null>(null);

	// Hooks
	const { records, loading, loadRecords } = useTimeRecords(
		format(date, "dd/MM/yyyy"),
	);
	const { config } = useConfig();
	const { theme } = useTheme();
	const {
		saveRegister,
		deleteRegister,
		extractDataPhoto,
		loading: registerLoading,
	} = useRegister();

	// Efeito para atualizar a data para o dia atual se não for controlado
	useEffect(() => {
		if (!controlledDate) {
			setDate(new Date());
		}
	}, [controlledDate, setDate]);

	const handleAutoSavePhoto = async () => {
		const { status } = await ImagePicker.requestCameraPermissionsAsync();
		if (status !== "granted") {
			alert("Permissão de câmera negada!");
			return;
		}

		const result = await ImagePicker.launchCameraAsync({
			mediaTypes: "images",
			allowsEditing: false,
			aspect: [4, 3],
			quality: 0.5,
		});

		if (!result.canceled || result.assets) {
			const formData = new FormData();
			const file = {
				uri: result.assets[0].uri, // A URI do arquivo (caminho local)
				name:
					result.assets[0].fileName || result.assets[0].uri.split("/").pop(), // Nome do arquivo. Use o nome retornado ou extraia da URI
				type: "image/jpeg", // O tipo MIME. O ImagePicker não retorna o tipo MIME no iOS/Android/Web de forma confiável, então defina-o
			};
			formData.append("file", file as any as File);

			const { date, time, nsr } = await extractDataPhoto(formData);
			const save = await saveRegister({
				date,
				createdAt: new Date(),
				updatedAt: new Date(),
				timeInMinutes: convertTimeToMinutes(time),
				nsr,
				type: "trabalho",
				location: "",
				photo: result.assets[0].uri,
				isFullDay: false,
			});
			const newDate = new Date(
				`${date.split("/").reverse().join("-")}T${time}:00`,
			);
			if (save) {
				setDate(newDate);
				loadRecords();
			}
		}
		return;
	};

	/**
	 * Navegação de data (dia anterior / seletor de data / próximo dia)
	 */
	const rawDateLabel = format(date, "EEEE, dd 'de' MMMM", { locale: ptBR });
	const dateLabel = rawDateLabel.charAt(0).toUpperCase() + rawDateLabel.slice(1);

	const renderDateNavigator = () => (
		<View className="flex-row justify-between items-center p-2 rounded-2xl border bg-surface border-secondary">
			<TouchableOpacity
				onPress={() => setDate(subDays(date, 1))}
				accessibilityRole="button"
				accessibilityLabel="Dia anterior"
				className="justify-center items-center w-12 h-12 rounded-full"
			>
				<Entypo name="chevron-left" size={26} color={colors[theme].accent} />
			</TouchableOpacity>
			<TouchableOpacity
				className="items-center"
				accessibilityRole="button"
				accessibilityLabel="Selecionar data"
				onPress={() => {
					DateTimePickerAndroid.open({
						value: date,
						mode: "date",
						onChange: (event, selectedDate) => {
							if (event.type === "set" && selectedDate) {
								setDate(selectedDate);
							}
						},
					});
				}}
			>
				<Text className="text-lg font-bold text-surface-content">
					{dateLabel}
				</Text>
				<Text className="text-sm text-surface-content">
					{format(date, "yyyy", { locale: ptBR })}
				</Text>
			</TouchableOpacity>
			<TouchableOpacity
				onPress={() => setDate(addDays(date, 1))}
				accessibilityRole="button"
				accessibilityLabel="Próximo dia"
				className="justify-center items-center w-12 h-12 rounded-full"
			>
				<Entypo name="chevron-right" size={26} color={colors[theme].accent} />
			</TouchableOpacity>
		</View>
	);

	/**
	 * Pontos esperados do dia, com base nos horários configurados
	 */
	const expectedPoints = useMemo(() => {
		if (!config) return [];
		return [
			{ label: "entrada", time: config.entraceTime },
			{ label: "saída para o almoço", time: config.entraceBufferTime },
			{ label: "volta do almoço", time: config.exitBufferTime },
			{ label: "saída", time: config.exitTime },
		].filter((point) => !!point.time) as { label: string; time: number }[];
	}, [config]);

	const isTodaySelected = isToday(date);
	const workRecordsCount = records.filter((r) => r.type === "trabalho").length;
	const nextExpected = expectedPoints[workRecordsCount];
	const punchLabel = nextExpected
		? `Registrar ${nextExpected.label}`
		: "Registrar ponto";

	/**
	 * Registra o ponto agora, com um toque (hoje, tipo trabalho)
	 */
	const handlePunch = async () => {
		if (registerLoading) return;
		const now = new Date();
		try {
			const id = await saveRegister({
				date: format(now, "dd/MM/yyyy"),
				timeInMinutes: now.getHours() * 60 + now.getMinutes(),
				type: "trabalho",
				isFullDay: false,
				location: "",
				photo: "",
				nsr: "",
				createdAt: now,
				updatedAt: now,
			});
			await loadRecords();
			setLastPunch({
				id,
				message: `${
					nextExpected
						? `${nextExpected.label.charAt(0).toUpperCase()}${nextExpected.label.slice(1)} registrada`
						: "Ponto registrado"
				} às ${format(now, "HH:mm")}`,
			});
		} catch {
			Alert.error("Não foi possível registrar o ponto. Tente novamente.");
		}
	};

	/**
	 * Desfaz o último ponto registrado com um toque
	 */
	const handleUndo = async () => {
		if (!lastPunch) return;
		const { id } = lastPunch;
		setLastPunch(null);
		try {
			await deleteRegister(id);
			await loadRecords();
		} catch {
			Alert.error("Não foi possível desfazer o registro.");
		}
	};

	const addHref = {
		pathname: "/add" as const,
		params: { date: format(date, "dd/MM/yyyy") },
	};

	/**
	 * Ação principal (um toque para registrar) e opções secundárias
	 */
	const renderActions = () => (
		<View className="gap-3">
			{isTodaySelected ? (
				<TouchableOpacity
					onPress={handlePunch}
					disabled={registerLoading}
					accessibilityRole="button"
					accessibilityLabel={punchLabel}
					className="flex-row justify-center items-center h-16 rounded-2xl bg-primary"
				>
					<Entypo
						name="check"
						size={26}
						color={colors[theme].primaryContent}
						style={{ marginRight: 10 }}
					/>
					<Text className="text-xl font-bold text-primary-content">
						{registerLoading ? "Registrando..." : punchLabel}
					</Text>
				</TouchableOpacity>
			) : (
				<Link href={addHref} asChild>
					<TouchableOpacity
						accessibilityRole="button"
						accessibilityLabel="Registrar ponto neste dia"
						className="flex-row justify-center items-center h-16 rounded-2xl bg-primary"
					>
						<Entypo
							name="plus"
							size={26}
							color={colors[theme].primaryContent}
							style={{ marginRight: 10 }}
						/>
						<Text className="text-xl font-bold text-primary-content">
							Registrar ponto neste dia
						</Text>
					</TouchableOpacity>
				</Link>
			)}
			<View className="flex-row gap-3">
				<TouchableOpacity
					onPress={handleAutoSavePhoto}
					accessibilityRole="button"
					accessibilityLabel="Registrar ponto por foto"
					className="flex-row flex-1 justify-center items-center h-12 rounded-2xl border border-accent"
				>
					<Octicons
						name="sparkles-fill"
						size={18}
						color={colors[theme].accent}
						style={{ marginRight: 8 }}
					/>
					<Text className="font-semibold text-surface-content">Por foto</Text>
				</TouchableOpacity>
				{isTodaySelected && (
					<Link href={addHref} asChild>
						<TouchableOpacity
							accessibilityRole="button"
							accessibilityLabel="Registrar em outro horário"
							className="flex-row flex-1 justify-center items-center h-12 rounded-2xl border border-accent"
						>
							<Entypo
								name="clock"
								size={18}
								color={colors[theme].accent}
								style={{ marginRight: 8 }}
							/>
							<Text className="font-semibold text-surface-content">
								Outro horário
							</Text>
						</TouchableOpacity>
					</Link>
				)}
			</View>
		</View>
	);

	/**
	 * Próximo ponto esperado do dia, com o horário configurado
	 */
	const nextPoint =
		isTodaySelected && nextExpected
			? `Previsto: ${nextExpected.label} às ${convertMinutesToTime(nextExpected.time)}`
			: null;

	/**
	 */
	const displayItems = useMemo(() => {
		type HistoryItem =
			| { type: "record"; data: RegisterData; isEntry: boolean }
			| { type: "break"; data: { formatted: string } };

		const items: HistoryItem[] = [];

		const workRecords = records
			.filter((r) => r.type === "trabalho")
			.sort((a, b) => a.timeInMinutes - b.timeInMinutes);

		const nonWorkRecords = records
			.filter((r) => r.type !== "trabalho")
			.sort((a, b) => a.timeInMinutes - b.timeInMinutes);

		// Adiciona registros de trabalho com intervalos
		for (let i = 0; i < workRecords.length; i++) {
			const record = workRecords[i];
			const isEntry = i % 2 === 0;

			// ponto atual (Entrada ou Saída)
			items.push({ type: "record", data: record, isEntry });

			// VERIFICAÇÃO DO INTERVALO:
			if (!isEntry && workRecords[i + 1]) {
				const breakMinutes =
					workRecords[i + 1].timeInMinutes - record.timeInMinutes;

				const hours = Math.floor(breakMinutes / 60);
				const minutes = breakMinutes % 60;

				if (hours > 0 || minutes > 0) {
					items.push({
						type: "break",
						data: { formatted: `${hours}h ${minutes}m intervalo` },
					});
				}
			}
		}

		// Adiciona registros de folga e atestado
		for (const record of nonWorkRecords) {
			items.push({ type: "record", data: record, isEntry: false });
		}

		// Ordena todos os itens por horário (considerando registros sem horário)
		items.sort((a, b) => {
			if (a.type === "record" && b.type === "record") {
				// Se algum dos registros não tem horário (dia completo), coloca no final
				if (!a.data.timeInMinutes && !b.data.timeInMinutes) return 0;
				if (!a.data.timeInMinutes) return 1;
				if (!b.data.timeInMinutes) return -1;
				return a.data.timeInMinutes - b.data.timeInMinutes;
			}
			return 0;
		});

		return items;
	}, [records]);

	/**
	 * Renderiza a lista de registros e intervalos
	 */
	const renderHistoryItems = () => {
		if (records.length === 0) {
			const workDays = config?.workDays;
			if (
				workDays &&
				Array.isArray(workDays) &&
				controlledDate && !workDays.includes(controlledDate.getDay())
			) {
				return (
					<View className="flex-1 justify-center items-center">
						<Text className="text-lg text-secondary-content">
							Você não trabalha neste dia
						</Text>
					</View>
				);
			}
		}

		return (
			<LinearGradient
				colors={[colors[theme].secondary, colors[theme].surface]}
				start={{ x: 0, y: 0 }}
				end={{ x: 1, y: 1 }}
				style={{
					justifyContent: "space-between",
					borderRadius: 16,
				}}
			>
				{registerLoading ? (
					<Loading />
				) : (
					<>
						{displayItems.map((item, index) => {
							if (item.type === "record") {
								return (
									<Record
										key={`record-${item.data.id}`}
										data={item.data}
										isEntry={item.isEntry}
									/>
								);
							} else if (item.type === "break") {
								return (
									<View
										key={`break-${index}`}
										className="flex-row justify-center items-center my-2"
									>
										<LinearGradient
											colors={[
												"transparent",
												colors[theme].secondaryContent,
												"transparent",
											]}
											start={{ x: 0, y: 0.5 }}
											end={{ x: 1, y: 0.5 }}
											style={{ flex: 1, height: 1, opacity: 0.2 }}
										/>
										<Text className="mx-4 text-sm bg-secondary-content text-secondary px-2 py-1 rounded-full">
											{item.data.formatted}
										</Text>
										<LinearGradient
											colors={[
												"transparent",
												colors[theme].secondaryContent,
												"transparent",
											]}
											start={{ x: 0, y: 0.5 }}
											end={{ x: 1, y: 0.5 }}
											style={{ flex: 1, height: 1, opacity: 0.2 }}
										/>
									</View>
								);
							}
							return null;
						})}
					</>
				)}
			</LinearGradient>
		);
	};

	if (loading) {
		return (
			<View className="flex-1 w-full rounded-xl h-fit">
				<View className="flex-1 justify-center items-center">
					<ActivityIndicator
						size="large"
						color={colors[theme].secondaryContent}
					/>
				</View>
			</View>
		);
	}

	return (
		<View className="flex-1 gap-4 w-full">
			{renderDateNavigator()}
			<Balance date={controlledDate || new Date()} records={records} />
			{renderActions()}
			{nextPoint && (
				<Text className="text-sm text-center text-background-content">
					{nextPoint}
				</Text>
			)}
			<View className="flex-1">
				<ScrollView>{renderHistoryItems()}</ScrollView>
			</View>
			{lastPunch && (
				<UndoBar
					message={lastPunch.message}
					onUndo={handleUndo}
					onDismiss={() => setLastPunch(null)}
				/>
			)}
		</View>
	);
}
