import { RegisterData } from '@/db/schema/registers'
import { useTheme } from '@/providers/ThemeProvider'
import { colors } from '@/utils/colorThemes'
import { Entypo } from '@expo/vector-icons'
import { Link } from 'expo-router'
import { Modal, Pressable, Text, View } from 'react-native'
import { Record } from '../Record'

interface DayRecordsModalProps {
  visible: boolean
  onClose: () => void
  records: RegisterData[]
  date: Date | null
}

export function DayRecordsModal({ visible, onClose, records, date }: DayRecordsModalProps) {
  const { theme } = useTheme()

  // Ordena por hora e calcula entrada/saída considerando apenas "trabalho"
  const sorted = [...records].sort((a, b) => a.timeInMinutes - b.timeInMinutes)
  const workRecords = sorted.filter((r) => r.type === 'trabalho')
  const workIndexById = new Map<number, number>()
  workRecords.forEach((r, idx) => {
    if (typeof r.id === 'number') workIndexById.set(r.id, idx)
  })

  return (
    <Modal animationType="slide" transparent={true} visible={visible} onRequestClose={onClose}>
      <View className="flex-1 justify-center items-center bg-black/50">
        <View className="m-5 bg-background p-5 rounded-2xl shadow-lg w-4/5">
          <Text className="text-lg font-bold text-background-content mb-4">
            Registros de {date?.toLocaleDateString('pt-BR')}
          </Text>
          {sorted.length > 0 ? (
            sorted.map((record) => {
              const idx = typeof record.id === 'number' ? workIndexById.get(record.id) : undefined
              const isEntry = record.type === 'trabalho' ? (idx ?? 0) % 2 === 0 : false

              return (
                <Record data={record} isEntry={isEntry} key={record.id} />
              )
            })
          ) : (
            <Text className="text-primary-content">Nenhum registro encontrado para este dia.</Text>
          )}
          <View className="mt-4 flex-row gap-x-2">
            <Link
              className="bg-primary p-3 rounded-lg items-center justify-center flex-row"
              href="/add"
            >
              <Entypo name="plus" size={20} color={colors[theme].primaryContent} style={{ marginRight: 8 }} />
              <Text className="text-primary-content font-bold">Registro Manual</Text>
            </Link>
            <Pressable className="flex-1 rounded-lg p-2 bg-primary" onPress={onClose}>
              <Text className="text-primary-content font-bold text-center">Fechar</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  )
}
