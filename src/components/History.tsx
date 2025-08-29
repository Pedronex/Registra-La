import { useTimeRecords } from '@/hooks/useTimeRecords';
import { getDay, getMonth, getYear, parse, subDays, addDays, format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { useEffect, useMemo, useState } from 'react';
import { Text, View, TouchableOpacity } from 'react-native';

/**
 * Componente que exibe o histórico de registros de ponto
 */
export function History() {
  // Estados
  const [date, setDate] = useState(new Date());

  // Hooks
  const { records, loading } = useTimeRecords(format(date, 'dd/MM/yyyy'));

  // Efeito para atualizar a data para o dia atual
  useEffect(() => {
    setDate(new Date());
  }, []);

  /**
   * Calcula o total de horas trabalhadas
   */
  const totalHoursWorked = useMemo(() => {
    if (records.length < 2) {
      return '00:00';
    }

    let totalMilliseconds = 0;
    for (let i = 0; i < records.length; i += 2) {
      if (records[i + 1]) {
        const startTime = parse(records[i].time, 'HH:mm', new Date());
        const endTime = parse(records[i + 1].time, 'HH:mm', new Date());
        totalMilliseconds += endTime.getTime() - startTime.getTime();
      }
    }

    const totalSeconds = totalMilliseconds / 1000;
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);

    return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
  }, [records]);

  /**
   * Renderiza o cabeçalho com a data e os botões de navegação
   */
  const renderHeader = () => (
    <View className="flex-row justify-between items-center mb-4">
      <TouchableOpacity onPress={() => setDate(subDays(date, 1))}>
        <Text className="text-2xl text-primary">{`<`}</Text>
      </TouchableOpacity>
      <Text className="text-xl text-primary">{format(date, 'dd/MM/yyyy', { locale: ptBR })}</Text>
      <TouchableOpacity onPress={() => setDate(addDays(date, 1))}>
        <Text className="text-2xl text-primary">{`>`}</Text>
      </TouchableOpacity>
    </View>
  );

  /**
   * Cria a lista de itens para exibição, incluindo registros e intervalos
   */
  const displayItems = useMemo(() => {
    const items = [];
    for (let i = 0; i < records.length; i++) {
      items.push({ type: 'record', data: records[i] });

      if (i % 2 !== 0 && records[i + 1]) {
        const exitTime = parse(records[i].time, 'HH:mm', new Date());
        const nextEntryTime = parse(records[i + 1].time, 'HH:mm', new Date());
        const breakMilliseconds = nextEntryTime.getTime() - exitTime.getTime();

        const totalSeconds = breakMilliseconds / 1000;
        const hours = Math.floor(totalSeconds / 3600);
        const minutes = Math.floor((totalSeconds % 3600) / 60);

        if (hours > 0 || minutes > 0) {
          items.push({
            type: 'break',
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
    <View className="flex-col">
      {displayItems.map((item, index) => {
        if (item.type === 'record') {
          return (
            <View key={`record-${item.data.id}`} className="flex-row justify-between items-center py-2 border-b border-gray-300">
              <Text className="text-lg">{item.data.time}</Text>
              <Text className="text-lg">{item.data.description}</Text>
            </View>
          );
        } else if (item.type === 'break') {
          return (
            <View key={`break-${index}`} className="items-center py-2">
              <Text className="text-base text-gray-500">{item.data.formatted}</Text>
            </View>
          );
        }
        return null;
      })}
    </View>
  );

  return (
    <View className="p-4 w-full bg-white rounded-lg shadow-md">
      {renderHeader()}
      {loading ? <Text>Carregando...</Text> : renderHistoryItems()}
      <View className="mt-4">
        <Text className="text-lg font-bold text-right">Total: {totalHoursWorked}</Text>
      </View>
    </View>
  );
}
