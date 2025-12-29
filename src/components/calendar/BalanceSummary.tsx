import { convertMinutesToTime } from "@/utils/convert";
import { Text, View } from "react-native";

interface BalanceSummaryProps {
  previousMonthBalance: number;
  monthBalance: number;
  currentBalance: number;
}

export function BalanceSummary({ previousMonthBalance, monthBalance, currentBalance }: BalanceSummaryProps) {
  return (
    <View className="mt-4 p-4 rounded-lg bg-secondary">
      <Text className="text-lg text-secondary-content mb-2">Resumo do Mês</Text>
      <Text className="text-secondary-content">Saldo do Mês Anterior: {convertMinutesToTime(previousMonthBalance)}</Text>
      <Text className="text-secondary-content">Saldo deste Mês: {convertMinutesToTime(monthBalance)}</Text>
      <Text className="text-secondary-content font-bold">Saldo Atual: {convertMinutesToTime(currentBalance)}</Text>
    </View>
  );
}
