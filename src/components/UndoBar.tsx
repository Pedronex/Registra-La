import { useEffect } from "react";
import { Text, TouchableOpacity, View } from "react-native";

interface UndoBarProps {
	message: string;
	onUndo: () => void;
	onDismiss: () => void;
	durationMs?: number;
}

/**
 * Barra de confirmação com ação de desfazer, exibida na parte inferior da tela
 */
export function UndoBar({
	message,
	onUndo,
	onDismiss,
	durationMs = 6000,
}: UndoBarProps) {
	useEffect(() => {
		const timer = setTimeout(onDismiss, durationMs);
		return () => clearTimeout(timer);
	}, [onDismiss, durationMs]);

	return (
		<View
			className="flex-row absolute right-0 bottom-0 left-0 justify-between items-center p-4 rounded-2xl bg-surface-content"
			accessibilityLiveRegion="polite"
		>
			<Text className="flex-1 mr-3 font-medium text-surface">{message}</Text>
			<TouchableOpacity
				onPress={onUndo}
				accessibilityRole="button"
				accessibilityLabel="Desfazer registro"
				hitSlop={12}
			>
				<Text className="font-bold underline text-surface">Desfazer</Text>
			</TouchableOpacity>
		</View>
	);
}
