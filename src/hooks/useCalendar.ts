import { database } from '@/db'
import { RegisterData, registersTable } from '@/db/schema'
import { parseDateDDMMYYYY } from '@/utils/dateTime'
import { useCallback, useEffect, useState } from 'react'
import { useConfig } from './useConfig'

// --- Interfaces ---
interface CalendarData {
  dailyBalances: Record<string, number>
  monthBalance: number
  previousMonthBalance: number
  currentBalance: number
  workedDays: Set<string>
  dailyRecords: Record<string, RegisterData[]>
}

// --- Helper Functions ---

/**
 * Fetches all records from the database and filters them for a specific month.
 */
async function fetchAndFilterRecordsForMonth(year: number, month: number): Promise<RegisterData[]> {
  const startDate = new Date(year, month - 1, 1)
  startDate.setHours(0, 0, 0, 0)
  const endDate = new Date(year, month, 0)
  endDate.setHours(23, 59, 59, 999)

  const allRecords = await database.select().from(registersTable)

  return allRecords.filter((record) => {
    try {
      const recordDate = parseDateDDMMYYYY(record.date)
      return (
        recordDate.getTime() >= startDate.getTime() && recordDate.getTime() <= endDate.getTime()
      )
    } catch (e) {
      console.error(`Error parsing date for record ID ${record.id}: ${record.date}`, e)
      return false
    }
  })
}

/**
 * Groups a list of records by their date string.
 */
function groupRecordsByDay(records: RegisterData[]): Record<string, RegisterData[]> {
  const dailyRecords: Record<string, RegisterData[]> = {}
  for (const record of records) {
    if (!dailyRecords[record.date]) {
      dailyRecords[record.date] = []
    }
    dailyRecords[record.date].push(record)
  }
  return dailyRecords
}

/**
 * Calculates daily balances, total balance, and worked days from grouped records.
 */
function calculateBalancesFromDailyRecords(
  dailyRecords: Record<string, RegisterData[]>,
  workHours: number,
) {
  const dailyBalances: Record<string, number> = {}
  let totalBalance = 0
  const workedDays = new Set<string>()

  for (const date in dailyRecords) {
    const dayRecords = dailyRecords[date]
    const workRecords = dayRecords
      .filter((r) => r.type === 'trabalho')
      .sort((a, b) => a.time.localeCompare(b.time))

    let workedMillis = 0
    const isoDate = date.split('/').reverse().join('-')
    if (workRecords.length >= 2) {
      for (let i = 0; i < workRecords.length; i += 2) {
        if (workRecords[i + 1]) {
          const timeIn = new Date(`${isoDate}T${workRecords[i].time}`).getTime()
          const timeOut = new Date(`${isoDate}T${workRecords[i + 1].time}`).getTime()
          workedMillis += timeOut - timeIn
        }
      }
    }

    // Soma abonos do dia (folga/atestado)
    let abonoMillis = 0
    const abonos = dayRecords.filter((r) => r.type !== 'trabalho')
    for (const a of abonos) {
      if (a.isFullDay) {
        abonoMillis += (workHours || 0) * 3600 * 1000
      } else if (a.time) {
        const [hh, mm] = (a.time || '0:0').split(':').map(Number)
        abonoMillis += ((hh || 0) * 60 + (mm || 0)) * 60 * 1000
      }
    }

    const workedHoursValue = (workedMillis + abonoMillis) / (1000 * 60 * 60)
    const balance = workedHoursValue - workHours
    dailyBalances[date] = balance
    totalBalance += balance
    if (workRecords.length > 0) {
      workedDays.add(date)
    }
  }

  return { dailyBalances, totalBalance, workedDays }
}

// --- Main Hook ---

export function useCalendar(year: number, month: number) {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [calendarData, setCalendarData] = useState<CalendarData>({
    dailyBalances: {},
    monthBalance: 0,
    previousMonthBalance: 0,
    currentBalance: 0,
    workedDays: new Set(),
    dailyRecords: {},
  })
  const { config } = useConfig()

  const getMonthlyData = useCallback(
    async (targetYear: number, targetMonth: number) => {
      if (!config) {
        return {
          dailyBalances: {},
          totalBalance: 0,
          workedDays: new Set<string>(),
          dailyRecords: {},
        }
      }

      const records = await fetchAndFilterRecordsForMonth(targetYear, targetMonth)
      const dailyRecords = groupRecordsByDay(records)
      const { dailyBalances, totalBalance, workedDays } = calculateBalancesFromDailyRecords(
        dailyRecords,
        config.workHours || 8,
      )

      return { dailyBalances, totalBalance, workedDays, dailyRecords }
    },
    [config],
  )

  const loadCalendarData = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)

      const currentMonthData = await getMonthlyData(year, month)

      const previousMonth = month === 1 ? 12 : month - 1
      const previousYear = month === 1 ? year - 1 : year
      const previousMonthData = await getMonthlyData(previousYear, previousMonth)

      setCalendarData({
        dailyBalances: currentMonthData.dailyBalances,
        monthBalance: currentMonthData.totalBalance,
        previousMonthBalance: previousMonthData.totalBalance,
        currentBalance: previousMonthData.totalBalance + currentMonthData.totalBalance,
        workedDays: currentMonthData.workedDays,
        dailyRecords: currentMonthData.dailyRecords,
      })
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'Erro ao carregar dados do calendário'
      setError(errorMessage)
    } finally {
      setLoading(false)
    }
  }, [year, month, getMonthlyData])

  useEffect(() => {
    loadCalendarData()
  }, [loadCalendarData])

  return { loading, error, ...calendarData, reload: loadCalendarData }
}
