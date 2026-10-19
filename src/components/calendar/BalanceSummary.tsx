import { convertMinutesToTime } from "@/utils/convert";
import { Text, View } from "react-native";

interface BalanceSummaryProps {
	previousMonthBalance: number;
	monthBalance: number;
	currentBalance: number;
}

function Stat({
	label,
	value,
	highlight = false,
}: {
	label: string;
	value: number;
	highlight?: boolean;
}) {
	return (
		<View
			className={`flex-1 items-center p-3 rounded-2xl border ${
				highlight ? "bg-primary border-primary" : "bg-surface border-secondary"
			}`}
			accessible
			accessibilityLabel={`${label}: ${convertMinutesToTime(value)}`}
		>
			<Text
				className={`text-xs ${highlight ? "text-primary-content" : "text-surface-content"}`}
			>
				{label}
			</Text>
			<Text
				className={`text-lg font-bold ${highlight ? "text-primary-content" : "text-surface-content"}`}
			>
				{convertMinutesToTime(value)}
			</Text>
		</View>
	);
}

/**
 * Resumo do mês: saldo anterior, saldo do mês e saldo atual
 */
export function BalanceSummary({
	previousMonthBalance,
	monthBalance,
	currentBalance,
}: BalanceSummaryProps) {
	return (
		<View className="flex-row gap-2 mb-4">
			<Stat label="Anterior" value={previousMonthBalance} />
			<Stat label="Este mês" value={monthBalance} />
			<Stat label="Saldo atual" value={currentBalance} highlight />
		</View>
	);
}
