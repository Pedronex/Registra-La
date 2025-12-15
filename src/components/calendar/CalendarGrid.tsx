import { Text, View } from "react-native";
import { DayCell } from "./DayCell";

interface CalendarGridProps {
  date: Date;
  dailyBalances: Record<string, number>;
  workedDays: Set<string>;
  onDayPress: (day: Date) => void;
}

export function CalendarGrid({ date, dailyBalances, workedDays, onDayPress }: CalendarGridProps) {
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
    while (week.length < 7) {
      week.push(null);
    }
    weeks.push(week);
  }

  return (
    <View>
      <View className="flex-row justify-around mb-2">
        {["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"].map(day => <Text key={day} className="w-12 text-center text-background-content">{day}</Text>)}
      </View>
      {weeks.map((week, i) => (
        <View key={i} className="flex-row justify-around mb-1">
          {week.map((day, j) => {
            const originalDateString = day ? `${String(day.getDate()).padStart(2, '0')}/${String(day.getMonth() + 1).padStart(2, '0')}/${day.getFullYear()}` : '';
            const balance = dailyBalances[originalDateString];
            const isWorked = workedDays.has(originalDateString);

            return (
              <DayCell
                key={j}
                day={day}
                balance={balance}
                isWorked={isWorked}
                onPress={onDayPress}

              />
            );
          })}
        </View>
      ))}
    </View>
  );
}
