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
    workedDays,
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

    const weeks: (Date | null)[][] = [];
    let week: (Date | null)[] = Array(firstDay).fill(null);

    for (let dayNum = 1; dayNum <= daysInMonth; dayNum++) {
      week.push(new Date(year, month, dayNum));
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
        if (isNaN(balance)) return "+00:00";
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
          <Text className="text-xl text-primary">{`${
            date.toLocaleString("default", { month: "long" })
          } ${date.getFullYear()}`}</Text>
          <TouchableOpacity onPress={() => changeMonth(1)}>
            <Entypo name="chevron-right" size={30} color={colors[theme].primary} />
          </TouchableOpacity>
        </View>
        <View className="flex-row justify-around mb-2">
            {["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"].map(day => <Text key={day} className="w-12 text-center text-secondary-content">{day}</Text>)}
        </View>
        {weeks.map((week, i) => (
          <View key={i} className="flex-row justify-around mb-1">
            {week.map((day, j) => {
              if (!day) return <View key={j} className="w-12 h-16" />;

              const originalDateString = `${String(day.getDate()).padStart(2, '0')}/${String(day.getMonth() + 1).padStart(2, '0')}/${day.getFullYear()}`;

              const balance = dailyBalances[originalDateString];
              const isWorked = workedDays.has(originalDateString);

              const today = new Date();
              const isToday = day.getDate() === today.getDate() && day.getMonth() === today.getMonth() && day.getFullYear() === today.getFullYear();

              const cellStyle = isToday ? "bg-primary" : (balance < 0 ? "bg-red-500" : "bg-secondary");
              const textStyle = isToday ? "text-primary-foreground" : (balance < 0 ? "text-white" : "text-secondary-content");

              return (
                <View key={j} className={`w-12 h-16 items-center justify-center rounded-lg ${cellStyle}`}>
                    <Text className={`font-bold ${textStyle}`}>{day.getDate()}</Text>
                    {balance !== undefined && <Text className={`text-xs ${textStyle}`}>{formatBalance(balance)}</Text>}
                    {isWorked && <Entypo name="check" size={16} color={isToday ? colors[theme].secondary : colors[theme].primary} />}
                </View>
              );
            })}
          </View>
        ))}
        <View className="mt-4 p-4 rounded-lg bg-secondary">
            <Text className="text-lg text-secondary-content mb-2">Resumo do Mês</Text>
            <Text className="text-secondary-content">Saldo do Mês Anterior: {formatBalance(previousMonthBalance)}</Text>
            <Text className="text-secondary-content">Saldo deste Mês: {formatBalance(monthBalance)}</Text>
            <Text className="text-secondary-content font-bold">Saldo Atual: {formatBalance(currentBalance)}</Text>
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
