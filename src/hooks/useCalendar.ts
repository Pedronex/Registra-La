import { useCallback, useEffect, useState } from "react";
import { database } from "@/db";
import { registersTable, RegisterData } from "@/db/schema";
import { and, gte, lte } from "drizzle-orm";
import { useConfig } from "./useConfig";

interface CalendarData {
  dailyBalances: Record<string, number>;
  monthBalance: number;
  previousMonthBalance: number;
  currentBalance: number;
}

export function useCalendar(year: number, month: number) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [calendarData, setCalendarData] = useState<CalendarData>({
    dailyBalances: {},
    monthBalance: 0,
    previousMonthBalance: 0,
    currentBalance: 0,
  });
  const { config } = useConfig();

  const calculateBalance = useCallback(async (targetYear: number, targetMonth: number) => {
    if (!config) return { dailyBalances: {}, totalBalance: 0 };

    const startDate = new Date(targetYear, targetMonth - 1, 1);
    const endDate = new Date(targetYear, targetMonth, 0);

    const records = await database.select().from(registersTable).where(
      and(
        gte(registersTable.date, startDate.toISOString().split('T')[0]),
        lte(registersTable.date, endDate.toISOString().split('T')[0])
      )
    );

    const dailyRecords: Record<string, RegisterData[]> = {};
    for (const record of records) {
      if (!dailyRecords[record.date]) {
        dailyRecords[record.date] = [];
      }
      dailyRecords[record.date].push(record);
    }

    const dailyBalances: Record<string, number> = {};
    let totalBalance = 0;

    for (const date in dailyRecords) {
      const dayRecords = dailyRecords[date];
      if (dayRecords.length % 2 !== 0) continue;

      let workedMillis = 0;
      for (let i = 0; i < dayRecords.length; i += 2) {
        const timeIn = new Date(`${date}T${dayRecords[i].time}`).getTime();
        const timeOut = new Date(`${date}T${dayRecords[i+1].time}`).getTime();
        workedMillis += timeOut - timeIn;
      }

      const workedHours = workedMillis / (1000 * 60 * 60);
      const balance = workedHours - (config.workHours || 8);
      dailyBalances[date] = balance;
      totalBalance += balance;
    }

    return { dailyBalances, totalBalance };
  }, [config]);

  const loadCalendarData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const { dailyBalances: currentMonthBalances, totalBalance: currentMonthTotal } = await calculateBalance(year, month);

      const previousMonth = month === 1 ? 12 : month - 1;
      const previousYear = month === 1 ? year - 1 : year;
      const { totalBalance: previousMonthTotal } = await calculateBalance(previousYear, previousMonth);

      setCalendarData({
        dailyBalances: currentMonthBalances,
        monthBalance: currentMonthTotal,
        previousMonthBalance: previousMonthTotal,
        currentBalance: previousMonthTotal + currentMonthTotal,
      });

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao carregar dados do calendário';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [year, month, calculateBalance]);

  useEffect(() => {
    loadCalendarData();
  }, [loadCalendarData]);

  return { loading, error, ...calendarData, reload: loadCalendarData };
}
