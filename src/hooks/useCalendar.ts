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
 * Fetches all records from the database.
 */
async function fetchAllRecords(): Promise<RegisterData[]> {
  return await database.select().from(registersTable)
}

/**
 * Filters a list of records for a specific month.
 */
function filterRecordsForMonth(
  records: RegisterData[],
  year: number,
  month: number,
): RegisterData[] {
  const startDate = new Date(year, month - 1, 1)
  startDate.setHours(0, 0, 0, 0)
  const endDate = new Date(year, month, 0)
  endDate.setHours(23, 59, 59, 999)

  return records.filter((record) => {
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
 * Aplica a tolerância ao saldo calculado.
 * Se o valor absoluto do saldo for menor ou igual à tolerância, retorna 0.
 */
function applyTolerance(balanceHours: number, toleranceMinutes: number): number {
  // Usa tolerância padrão de 10 minutos se não configurada
  const effectiveTolerance = toleranceMinutes || 10

  // Converte para minutos para evitar problemas de precisão de ponto flutuante
  const balanceMinutes = Math.round(balanceHours * 60)

  if (Math.abs(balanceMinutes) <= effectiveTolerance) {
    console.log(`[applyTolerance] Applied tolerance: ${balanceHours}h -> 0h`)
    return 0
  }

  console.log(`[applyTolerance] Outside tolerance: ${balanceHours}h remains unchanged`)
  return balanceHours
}

/**
 * Calculates daily balances, total balance, and worked days from grouped records.
 */
function calculateBalancesFromDailyRecords(
  dailyRecords: Record<string, RegisterData[]>,
  workHours: number,
  toleranceMinutes: number = 0,
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

    // Separa os registros de saldo dos outros abonos
    const balanceAdjustments = dayRecords.filter((r) => r.type === 'saldo')
    const abonos = dayRecords.filter((r) => r.type !== 'trabalho' && r.type !== 'saldo')

    // Processa os ajustes de saldo
    for (const adj of balanceAdjustments) {
      const [hh, mm] = (adj.time || '0:0').split(':').map(Number)
      const adjMillis = ((hh || 0) * 60 + (mm || 0)) * 60 * 1000
      const adjHours = adjMillis / (1000 * 60 * 60)

      if (adj.isFullDay) {
        // isFullDay representa 'increase'
        totalBalance += adjHours
      } else {
        // representa 'decrease'
        totalBalance -= adjHours
      }
    }

    // Soma abonos do dia (folga/atestado)
    let abonoMillis = 0
    for (const a of abonos) {
      if (a.isFullDay) {
        abonoMillis += (workHours || 0) * 3600 * 1000
      } else if (a.time) {
        const [hh, mm] = (a.time || '0:0').split(':').map(Number)
        abonoMillis += ((hh || 0) * 60 + (mm || 0)) * 60 * 1000
      }
    }

    const workedHoursValue = (workedMillis + abonoMillis) / (1000 * 60 * 60)
    const rawBalance = workedHoursValue - workHours

    // Aplica a tolerância ao saldo diário
    const balance = applyTolerance(rawBalance, toleranceMinutes)

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
    (records: RegisterData[], targetYear: number, targetMonth: number) => {
      if (!config) {
        return {
          dailyBalances: {},
          totalBalance: 0,
          workedDays: new Set<string>(),
          dailyRecords: {},
        }
      }

      const monthlyRecords = filterRecordsForMonth(records, targetYear, targetMonth)
      const dailyRecords = groupRecordsByDay(monthlyRecords)
      const { dailyBalances, totalBalance, workedDays } = calculateBalancesFromDailyRecords(
        dailyRecords,
        config.workHours || 8,
        config.tolerance || 0, // Tolerância padrão
      )

      return { dailyBalances, totalBalance, workedDays, dailyRecords }
    },
    [config],
  )

  const loadCalendarData = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)

      if (!config) return

      const allRecords = await fetchAllRecords()

      const firstRecord = allRecords.sort(
        (a, b) => parseDateDDMMYYYY(a.date).getTime() - parseDateDDMMYYYY(b.date).getTime(),
      )[0]

      let previousMonthBalance = config.initialBalance || 0

      if (firstRecord) {
        const firstDate = parseDateDDMMYYYY(firstRecord.date)
        let currentDate = new Date(firstDate.getFullYear(), firstDate.getMonth(), 1)
        const targetDate = new Date(year, month - 1, 1)

        while (currentDate < targetDate) {
          const monthData = getMonthlyData(
            allRecords,
            currentDate.getFullYear(),
            currentDate.getMonth() + 1,
          )
          previousMonthBalance += monthData.totalBalance
          currentDate.setMonth(currentDate.getMonth() + 1)
        }
      }

      const currentMonthData = getMonthlyData(allRecords, year, month)
      const monthBalance = currentMonthData.totalBalance
      const currentBalance = previousMonthBalance + monthBalance

      setCalendarData({
        dailyBalances: currentMonthData.dailyBalances,
        monthBalance,
        previousMonthBalance,
        currentBalance,
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
  }, [year, month, getMonthlyData, config])

  useEffect(() => {
    loadCalendarData()
  }, [loadCalendarData])

  return { loading, error, ...calendarData, reload: loadCalendarData }
}
