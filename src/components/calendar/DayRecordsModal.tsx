import { RegisterData } from "@/db/schema";
import { useTheme } from "@/providers/ThemeProvider";
import { colors } from "@/utils/colorThemes";
import { MaterialIcons } from "@expo/vector-icons";
import { Link } from "expo-router";
import { Modal, Pressable, Text, View } from "react-native";

interface DayRecordsModalProps {
  visible: boolean;
  onClose: () => void;
  records: RegisterData[];
  date: Date | null;
}

export function DayRecordsModal({ visible, onClose, records, date }: DayRecordsModalProps) {
  const { theme } = useTheme();

  // Ordena por hora e calcula entrada/saída considerando apenas "trabalho"
  const sorted = [...records].sort((a, b) => a.time.localeCompare(b.time));
  const workRecords = sorted.filter(r => r.type === 'trabalho');
  const workIndexById = new Map<number, number>();
  workRecords.forEach((r, idx) => { if (typeof r.id === 'number') workIndexById.set(r.id, idx); });

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View className="flex-1 justify-center items-center bg-black/50">
        <View className="m-5 bg-background p-5 rounded-2xl shadow-lg w-4/5">
          <Text className="text-lg font-bold text-primary-content mb-4">
            Registros de {date?.toLocaleDateString('pt-BR')}
          </Text>
          {sorted.length > 0 ? (
            sorted.map((record) => {
              const idx = typeof record.id === 'number' ? workIndexById.get(record.id) : undefined;
              const isEntry = record.type === 'trabalho' ? ((idx ?? 0) % 2 === 0) : false;
              const label = record.type === 'trabalho'
                ? (isEntry ? 'Entrada' : 'Saída')
                : (record.type === 'folga'
                    ? (record.isFullDay ? 'Folga - dia todo' : 'Folga - horas')
                    : 'Atestado');
              const iconName = record.type === 'trabalho'
                ? (isEntry ? 'login' : 'logout')
                : (record.type === 'folga' ? 'beach-access' : 'medical-services');
              return (
                <View key={record.id} className="flex-row items-center justify-between mb-2">
                  <View className="flex-row items-center gap-x-2">
                    <MaterialIcons name={iconName as any} size={20} color={colors[theme].primaryContent} />
                    <Text className="text-primary-content">{label}:</Text>
                  </View>
                  <Text className="text-primary-content font-bold">{record.time}</Text>
                </View>
              );
            })
          ) : (
            <Text className="text-primary-content">Nenhum registro encontrado para este dia.</Text>
          )}
          <View className="mt-4 flex-row gap-x-2">
            <Link
              href={{ pathname: "/add", params: { date: date ? `${String(date.getDate()).padStart(2,'0')}/${String(date.getMonth()+1).padStart(2,'0')}/${date.getFullYear()}` : '' } }}
              asChild
            >
              <Pressable className="flex-1 rounded-lg p-2 bg-success">
                <Text className="text-success-content font-bold text-center">Registrar nesta data</Text>
              </Pressable>
            </Link>
            <Pressable
              className="flex-1 rounded-lg p-2 bg-primary"
              onPress={onClose}
            >
              <Text className="text-primary-content font-bold text-center">Fechar</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
}
