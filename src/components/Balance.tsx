import { RegisterData } from "@/db/schema/registers";
import { useConfig } from "@/hooks/useConfig";
import { useTheme } from "@/providers/ThemeProvider";
import { colors } from "@/utils/colorThemes";
import { convertSecondsToTime } from "@/utils/convert";
import { Entypo } from "@expo/vector-icons";
import { isToday } from "date-fns";
import { LinearGradient } from "expo-linear-gradient";
import { useEffect, useMemo, useState } from "react";
import { Text, View } from "react-native";

export function Balance({ date, records }: { date: Date; records: RegisterData[] }) {
    const { theme } = useTheme()
    const { config } = useConfig()

    const [currentTimeInSeconds, setCurrentTimeInSeconds] = useState(
        new Date().getHours() * 3600 + new Date().getMinutes() * 60 + new Date().getSeconds(),
    )

    const isClockedIn = useMemo(() => {
        if (!isToday(date)) {
            return false
        }
        const workRecords = records.filter((r) => r.type === 'trabalho')
        return workRecords.length % 2 !== 0
    }, [records, date])

    useEffect(() => {
        let timer: NodeJS.Timeout | null = null

        if (isClockedIn) {
            timer = setInterval(() => {
                setCurrentTimeInSeconds(
                    new Date().getHours() * 3600 + new Date().getMinutes() * 60 + new Date().getSeconds(),
                )
            }, 1000)
        }

        return () => {
            if (timer) {
                clearInterval(timer)
            }
        }
    }, [isClockedIn])

    /**
       * Calcula o total de horas trabalhadas
       */
    const totalHoursWorked = useMemo(() => {
        const workRecords = records
            .filter((r) => r.type === 'trabalho')
            .sort((a, b) => a.timeInMinutes - b.timeInMinutes)

        let totalInSeconds = 0
        for (let i = 0; i < workRecords.length; i += 2) {
            if (workRecords[i + 1]) {
                totalInSeconds += workRecords[i + 1].timeInMinutes * 60 - workRecords[i].timeInMinutes * 60
            }
        }

        if (isClockedIn) {
            const lastEntry = workRecords[workRecords.length - 1]
            if (lastEntry) {
                totalInSeconds += currentTimeInSeconds - lastEntry.timeInMinutes * 60
            }
        }
        if (totalInSeconds <= 0) return '00:00'

        return convertSecondsToTime(totalInSeconds)
    }, [records, isClockedIn, currentTimeInSeconds])

    /**
     * Calcula o saldo de horas do dia
     */
    const hourBalance = useMemo(() => {
        const workRecords = records
            .filter((r) => r.type === 'trabalho')
            .sort((a, b) => a.timeInMinutes - b.timeInMinutes)

        // Correção: workHours é em minutos (ex: 480), então multiplicamos por 60 para ter segundos
        // Antes estava multiplicando por 3600 (tratando como horas)
        const targetSeconds = (config?.workHours || 0) * 60

        if (!config?.workHours || workRecords.length < 2) {
            // Mesmo sem pares de trabalho suficientes, ainda podemos ter abono que zere o saldo
            if (!config?.workHours) return '00:00'

            let abonoSeconds = 0
            const abonos = records.filter((r) => r.type !== 'trabalho')
            for (const a of abonos) {
                if (a.isFullDay) {
                    abonoSeconds += targetSeconds
                } else if (a.timeInMinutes) {
                    abonoSeconds += a.timeInMinutes * 60
                }
            }

            const diffSeconds = abonoSeconds - targetSeconds
            const toleranceSeconds = (config.tolerance || 10) * 60

            if (Math.abs(diffSeconds) <= toleranceSeconds) {
                return '00:00'
            }
            // Retorna com sinal
            return convertSecondsToTime(diffSeconds)
        }

        let totalInSeconds = 0
        for (let i = 0; i < workRecords.length; i += 2) {
            if (workRecords[i + 1]) {
                totalInSeconds += workRecords[i + 1].timeInMinutes * 60 - workRecords[i].timeInMinutes * 60
            }
        }

        if (isClockedIn) {
            const lastEntry = workRecords[workRecords.length - 1]
            if (lastEntry) {
                totalInSeconds += currentTimeInSeconds - lastEntry.timeInMinutes * 60
            }
        }

        // Soma de abonos (folga/atestado)
        let abonoSeconds = 0
        const abonos = records.filter((r) => r.type !== 'trabalho')
        for (const a of abonos) {
            if (a.isFullDay) {
                abonoSeconds += targetSeconds
            } else if (a.timeInMinutes) {
                abonoSeconds += a.timeInMinutes * 60
            }
        }

        const diffSeconds = totalInSeconds + abonoSeconds - targetSeconds
        const toleranceSeconds = (config.tolerance || 10) * 60

        if (Math.abs(diffSeconds) <= toleranceSeconds) {
            return '00:00'
        }
        // Retorna com sinal
        return convertSecondsToTime(diffSeconds)
    }, [records, config, isClockedIn, currentTimeInSeconds])


    return (
        <LinearGradient
            colors={[
                hourBalance.includes('-') ? colors[theme].error : colors[theme].success,
                colors[theme].secondary,
            ]}
            start={{ x: 1, y: 1 }}
            end={{ x: 0, y: 0 }}
            style={{ borderRadius: 8 }}
            className="p-4 mt-4 shadow-md flex-row flex-wrap justify-between"
        >
            <View className="flex-col justify-between items-start w-1/2">
                <Text className="text-lg text-tertiary-content">Total trabalhado:</Text>
                <Text className="text-3xl font-bold text-tertiary-content">{totalHoursWorked}</Text>
            </View>
            <View className="p-3 w-fit m-2 h-fit bg-black/10 dark:bg-white/10 rounded-2xl">
                <Entypo
                    name="clock"
                    size={28}
                    color={
                        hourBalance.includes('-') ? colors[theme].errorContent : colors[theme].successContent
                    }
                />
            </View>
            <View className="w-full h-px bg-black/20 dark:bg-white/20" />
            <View className="flex-row justify-between items-center col-span-2">
                <Text className="text-sm text-tertiary-content">Banco de Horas:</Text>
                <Text
                    className={`text-2xl ml-2 text-${hourBalance.includes('-') ? 'error-content' : 'success-content'}`}
                >
                    {hourBalance}
                </Text>
            </View>
        </LinearGradient>
    )
}