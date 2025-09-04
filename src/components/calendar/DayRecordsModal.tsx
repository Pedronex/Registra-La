import { RegisterData } from "@/db/schema";
import { Modal, View, Text, Pressable } from "react-native";

interface DayRecordsModalProps {
  visible: boolean;
  onClose: () => void;
  records: RegisterData[];
  date: Date | null;
}

export function DayRecordsModal({ visible, onClose, records, date }: DayRecordsModalProps) {
  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View className="flex-1 justify-center items-center bg-black/50">
        <View className="m-5 bg-background p-5 rounded-2xl shadow-lg w-4/5">
          <Text className="text-lg font-bold text-text mb-4">
            Registros de {date?.toLocaleDateString('pt-BR')}
          </Text>
          {records.length > 0 ? (
            records.map((record, index) => (
              <View key={record.id} className="flex-row justify-between items-center mb-2">
                <Text className="text-text">{(index % 2 === 0) ? 'Entrada' : 'Saída'}:</Text>
                <Text className="text-text font-bold">{record.time}</Text>
              </View>
            ))
          ) : (
            <Text className="text-text">Nenhum registro encontrado para este dia.</Text>
          )}
          <Pressable
            className="rounded-lg p-2 bg-primary mt-4"
            onPress={onClose}
          >
            <Text className="text-white font-bold text-center">Fechar</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
}
