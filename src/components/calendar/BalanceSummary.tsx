import { Text, View } from "react-native";

interface BalanceSummaryProps {
  previousMonthBalance: number;
  monthBalance: number;
  currentBalance: number;
}

function formatBalance(balance: number) {
    if (isNaN(balance)) return "+00:00";
    const hours = Math.floor(Math.abs(balance));
    const minutes = Math.round((Math.abs(balance) % 1) * 60);
    const sign = balance < 0 ? "-" : "+";
    return `${sign}${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
}

export function BalanceSummary({ previousMonthBalance, monthBalance, currentBalance }: BalanceSummaryProps) {
  return (
    <View className="mt-4 p-4 rounded-lg bg-secondary">
      <Text className="text-lg text-secondary-content mb-2">Resumo do Mês</Text>
      <Text className="text-secondary-content">Saldo do Mês Anterior: {formatBalance(previousMonthBalance)}</Text>
      <Text className="text-secondary-content">Saldo deste Mês: {formatBalance(monthBalance)}</Text>
      <Text className="text-secondary-content font-bold">Saldo Atual: {formatBalance(currentBalance)}</Text>
    </View>
  );
}
