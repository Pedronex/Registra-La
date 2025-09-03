import { Header } from "@/components/Header";
import { useCalendar } from "@/hooks/useCalendar";
import { useTheme } from "@/providers/ThemeProvider";
import { colors } from "@/utils/colorThemes";
import { Entypo } from "@expo/vector-icons";
import { useState } from "react";
import { ActivityIndicator, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function CalendarPage() {
  const [date, setDate] = useState(new Date());
  const {
    loading,
    error,
    dailyBalances,
    monthBalance,
    previousMonthBalance,
    currentBalance,
  } = useCalendar(date.getFullYear(), date.getMonth() + 1);
  const { theme } = useTheme();

  const changeMonth = (amount: number) => {
    setDate(new Date(date.getFullYear(), date.getMonth() + amount, 1));
  };

  const renderCalendar = () => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const weeks: (number | null)[][] = [];
    let week: (number | null)[] = Array(firstDay).fill(null);

    for (let day = 1; day <= daysInMonth; day++) {
      week.push(day);
      if (week.length === 7) {
        weeks.push(week);
        week = [];
      }
    }
    if (week.length > 0) {
      while(week.length < 7) {
        week.push(null);
      }
      weeks.push(week);
    }

    const formatBalance = (balance: number) => {
        const hours = Math.floor(Math.abs(balance));
        const minutes = Math.round((Math.abs(balance) % 1) * 60);
        const sign = balance < 0 ? "-" : "+";
        return `${sign}${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
    }

    return (
      <View>
        <View className="flex-row justify-between items-center mb-4">
          <TouchableOpacity onPress={() => changeMonth(-1)}>
            <Entypo name="chevron-left" size={30} color={colors[theme].primary} />
          </TouchableOpacity>
          <Text className="text-xl text-text">{`${
            date.toLocaleString("default", { month: "long" })
          } ${date.getFullYear()}`}</Text>
          <TouchableOpacity onPress={() => changeMonth(1)}>
            <Entypo name="chevron-right" size={30} color={colors[theme].primary} />
          </TouchableOpacity>
        </View>
        <View className="flex-row justify-around mb-2">
            {["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"].map(day => <Text key={day} className="w-12 text-center text-text">{day}</Text>)}
        </View>
        {weeks.map((week, i) => (
          <View key={i} className="flex-row justify-around">
            {week.map((day, j) => {
              const dayString = day ? `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}` : '';
              const balance = dailyBalances[dayString];
              return (
                <View key={j} className="w-12 h-12 items-center justify-center">
                  {day && (
                    <View className="items-center">
                        <Text className="text-text">{day}</Text>
                        {balance !== undefined && <Text className={`text-xs ${balance >= 0 ? 'text-green-500' : 'text-red-500'}`}>{formatBalance(balance)}</Text>}
                    </View>
                  )}
                </View>
              );
            })}
          </View>
        ))}
        <View className="mt-4 p-4 rounded-lg bg-card">
            <Text className="text-lg text-card-foreground mb-2">Resumo do Mês</Text>
            <Text className="text-text">Saldo do Mês Anterior: {formatBalance(previousMonthBalance)}</Text>
            <Text className="text-text">Saldo deste Mês: {formatBalance(monthBalance)}</Text>
            <Text className="text-text font-bold">Saldo Atual: {formatBalance(currentBalance)}</Text>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView className="flex-1 bg-background">
      <Header title="Calendário" />
      <View className="flex-1 p-4">
        {loading ? (
          <ActivityIndicator size="large" color={colors[theme].primary} />
        ) : error ? (
          <Text className="text-red-500">{error}</Text>
        ) : (
          renderCalendar()
        )}
      </View>
    </SafeAreaView>
  );
}
