import { Header } from "@/components/Header";
import { RegisterData } from "@/db/schema";
import { useCalendar } from "@/hooks/useCalendar";
import { useState } from "react";
import { ActivityIndicator, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { MonthNavigator } from "@/components/calendar/MonthNavigator";
import { CalendarGrid } from "@/components/calendar/CalendarGrid";
import { BalanceSummary } from "@/components/calendar/BalanceSummary";
import { DayRecordsModal } from "@/components/calendar/DayRecordsModal";

export default function CalendarPage() {
  // --- State ---
  const [date, setDate] = useState(new Date());
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedDayRecords, setSelectedDayRecords] = useState<RegisterData[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  // --- Data Fetching ---
  const {
    loading,
    error, // TODO: Display error state in the UI
    dailyBalances,
    monthBalance,
    previousMonthBalance,
    currentBalance,
    workedDays,
    dailyRecords,
  } = useCalendar(date.getFullYear(), date.getMonth() + 1);

  // --- Handlers ---
  const changeMonth = (amount: number) => {
    setDate(new Date(date.getFullYear(), date.getMonth() + amount, 1));
  };

  const openDayDetails = (day: Date) => {
    const originalDateString = `${String(day.getDate()).padStart(2, '0')}/${String(day.getMonth() + 1).padStart(2, '0')}/${day.getFullYear()}`;
    const records = dailyRecords[originalDateString] || [];
    setSelectedDayRecords(records);
    setSelectedDate(day);
    setModalVisible(true);
  };

  const closeDayDetails = () => {
    setModalVisible(false);
    setSelectedDate(null);
    setSelectedDayRecords([]);
  };

  // --- Render ---
  return (
    <SafeAreaView className="flex-1 bg-background">
      <Header title="Calendário" />
      <View className="flex-1 p-4">
        {loading ? (
          <ActivityIndicator size="large" />
        ) : (
          <>
            <MonthNavigator date={date} onChangeMonth={changeMonth} />
            <CalendarGrid
              date={date}
              dailyBalances={dailyBalances}
              workedDays={workedDays}
              onDayPress={openDayDetails}
            />
            <BalanceSummary
              previousMonthBalance={previousMonthBalance}
              monthBalance={monthBalance}
              currentBalance={currentBalance}
            />
          </>
        )}
      </View>
      <DayRecordsModal
        visible={modalVisible}
        onClose={closeDayDetails}
        records={selectedDayRecords}
        date={selectedDate}
      />
    </SafeAreaView>
  );
}
