import * as ImagePicker from "expo-image-picker";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useState } from "react";
import {
	ActivityIndicator,
	KeyboardAvoidingView,
	ScrollView,
	Text,
	TouchableOpacity,
	View,
} from "react-native";
import { SafeAreaView } from "@/components/styled";

import { BackButton } from "@/components/BackButton";
import { Header } from "@/components/Header";
import { RegisterForm } from "@/components/RegisterForm";
import { RegisterInsert } from "@/db/schema/registers";
import { useConfig } from "@/hooks/useConfig";
import { useRegister } from "@/hooks/useRegister";
import { useTheme } from "@/providers/ThemeProvider";
import { colors } from "@/utils/colorThemes";
import { convertTimeToMinutes } from "@/utils/convert";

const TYPES = ["trabalho", "folga", "atestado", "saldo"];

/**
 * Página de registro de ponto
 * Permite o usuário registrar o seu ponto
 */
export default function RegisterPage() {
	const router = useRouter();
	const params = useLocalSearchParams<{ date?: string }>();
	const [register, setRegister] = useState<RegisterInsert>({
		createdAt: new Date(),
		updatedAt: new Date(),
		date:
			typeof params.date === "string" && params.date
				? params.date
				: new Date().toLocaleDateString("pt-BR"),
		timeInMinutes: new Date().getHours() * 60 + new Date().getMinutes(),
		type: "trabalho",
		nsr: "",
		location: "",
		photo: "",
		isFullDay: false,
	});

	const { config } = useConfig();
	const { theme } = useTheme();
	const { saveRegister, extractDataPhoto, loading } = useRegister();

	const handleTakePhoto = async () => {
		if (!config) {
			return;
		}
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

			setRegister({
				...register,
				photo: result.assets[0].uri,
			});
			if (register.type === "trabalho") {
				const { date, time, nsr } = await extractDataPhoto(formData);

				setRegister((prev) => ({
					...prev,
					date,
					timeInMinutes: convertTimeToMinutes(time),
					nsr,
				}));
			}
		}
		return;
	};

	const handleInputChange = (
		field: keyof RegisterInsert,
		value: string | Date | boolean | number,
	) => {
		setRegister((prev) => ({
			...prev,
			[field]: value,
		}));
	};

	async function handleRegister() {
		const result = await saveRegister(register);

		if (result) {
			router.push("/(tabs)/");
		}
	}

	if (loading) {
		return (
			<View className="flex-1 justify-center items-center p-6 bg-background">
				<ActivityIndicator
					size="large"
					className="mb-3"
					color={colors[theme].backgroundColor}
				/>
				<Text className="text-lg font-medium text-background-content">
					Processando dados da foto...
				</Text>
			</View>
		);
	}

	return (
		<SafeAreaView className="flex-1 items-center pl-4 pr-4 pb-5 bg-background">
			<Header
				title="Novo registro"
				showConfig={false}
				back={() => <BackButton />}
			/>
			<KeyboardAvoidingView behavior="padding" className="flex-1 w-full">
				<ScrollView
					className="flex-1"
					keyboardShouldPersistTaps="handled"
					contentContainerStyle={{ paddingBottom: 16 }}
				>
					<RegisterForm
						register={register}
						types={TYPES}
						onChange={handleInputChange}
						onTakePhoto={handleTakePhoto}
						workHours={config?.workHours}
					/>
				</ScrollView>
				<TouchableOpacity
					className="justify-center items-center h-14 rounded-2xl bg-primary"
					onPress={handleRegister}
					disabled={loading}
					accessibilityRole="button"
					accessibilityLabel="Registrar"
				>
					<Text className="text-lg font-bold text-primary-content">
						{loading ? "Salvando..." : "Registrar"}
					</Text>
				</TouchableOpacity>
			</KeyboardAvoidingView>
		</SafeAreaView>
	);
}
