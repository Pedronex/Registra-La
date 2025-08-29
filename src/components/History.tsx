import { RegisterData } from "@/db/schema";
import { useTimeRecords } from "@/hooks/useTimeRecords";
import { useTheme } from "@/providers/ThemeProvider";
import { Entypo } from "@expo/vector-icons";
import { addDays, format, parse, subDays } from "date-fns";
import { ptBR } from "date-fns/locale";
import { useEffect, useMemo, useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";

/**
 * Componente que exibe o histórico de registros de ponto
 */
export function History() {
  // Estados
  const [date, setDate] = useState(new Date());

  // Hooks
  const { records, loading } = useTimeRecords(format(date, "dd/MM/yyyy"));
  const { theme } = useTheme();

  const isDark = theme === "dark";

  // Efeito para atualizar a data para o dia atual
  useEffect(() => {
    setDate(new Date());
  }, []);

  /**
   * Calcula o total de horas trabalhadas
   */
  const totalHoursWorked = useMemo(() => {
    if (records.length < 2) {
      return "00:00";
    }

    let totalMilliseconds = 0;
    for (let i = 0; i < records.length; i += 2) {
      if (records[i + 1]) {
        const startTime = parse(records[i].time, "HH:mm", new Date());
        const endTime = parse(records[i + 1].time, "HH:mm", new Date());
        totalMilliseconds += endTime.getTime() - startTime.getTime();
      }
    }

    const totalSeconds = totalMilliseconds / 1000;
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);

    return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(
      2,
      "0"
    )}`;
  }, [records]);

  /**
   * Renderiza o cabeçalho com a data e os botões de navegação
   */
  const renderHeader = () => (
    <View className="flex-row justify-between items-center p-2 mb-4 rounded-lg bg-primary">
      <TouchableOpacity
        onPress={() => setDate(subDays(date, 1))}
        className="p-2 rounded-full border border-primary-content"
      >
        <Entypo
          name="arrow-left"
          size={30}
          color={isDark ? "#332D41" : "#FFFFFF"}
        />
      </TouchableOpacity>
      <Text className="text-3xl text-secondary-content">
        {format(date, "dd/MM/yyyy", { locale: ptBR })}
      </Text>
      <TouchableOpacity
        onPress={() => setDate(addDays(date, 1))}
        className="p-2 rounded-full border border-primary-content"
      >
        <Entypo
          name="arrow-right"
          size={30}
          color={isDark ? "#332D41" : "#FFFFFF"}
        />
      </TouchableOpacity>
    </View>
  );

  /**
   * Cria a lista de itens para exibição, incluindo registros e intervalos
   */
  const displayItems = useMemo(() => {
    type HistoryItem =
      | { type: "record"; data: RegisterData }
      | { type: "break"; data: { formatted: string } };

    const items: HistoryItem[] = [];
    for (let i = 0; i < records.length; i++) {
      items.push({ type: "record", data: records[i] });

      if (i % 2 !== 0 && records[i + 1]) {
        const exitTime = parse(records[i].time, "HH:mm", new Date());
        const nextEntryTime = parse(records[i + 1].time, "HH:mm", new Date());
        const breakMilliseconds = nextEntryTime.getTime() - exitTime.getTime();

        const totalSeconds = breakMilliseconds / 1000;
        const hours = Math.floor(totalSeconds / 3600);
        const minutes = Math.floor((totalSeconds % 3600) / 60);

        if (hours > 0 || minutes > 0) {
          items.push({
            type: "break",
            data: {
              formatted: `${hours}h ${minutes}m intervalo`,
            },
          });
        }
      }
    }
    return items;
  }, [records]);

  /**
   * Renderiza a lista de registros e intervalos
   */
  const renderHistoryItems = () => (
    <View className="flex-col p-4 rounded bg-secondary">
      {displayItems.map((item, index) => {
        if (item.type === "record") {
          return (
            <View
              key={`record-${item.data.id}`}
              className="flex-row justify-between items-center py-2 border-b border-secondary-content"
            >
              <Text className="w-full text-2xl text-center text-secondary-content">
                {item.data.time}
              </Text>
              <Text className="text-lg text-secondary-content">
                {item.data.description}
              </Text>
            </View>
          );
        } else if (item.type === "break") {
          return (
            <View key={`break-${index}`} className="items-center py-2">
              <Text className="text-base text-secondary-content">
                {item.data.formatted}
              </Text>
            </View>
          );
        }
        return null;
      })}
    </View>
  );

  return (
    <View className="justify-between w-full h-full rounded-lg shadow-md">
      {renderHeader()}
      {loading ? <Text>Carregando...</Text> : renderHistoryItems()}
      <View className="p-2 mt-4 rounded-lg bg-tertiary">
        <View className="flex-col justify-between items-center">
          <Text className="text-lg font-bold text-tertiary-content">
            Total trabalhado: {totalHoursWorked}
          </Text>
        </View>
      </View>
    </View>
  );
}
