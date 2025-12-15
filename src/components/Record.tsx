import { RegisterData } from "@/db/schema/registers";
import { useTheme } from "@/providers/ThemeProvider";
import { colors } from "@/utils/colorThemes";
import { convertMinutesToTime } from "@/utils/convert";
import { MaterialIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import { Text, TouchableOpacity, View } from "react-native";

export type RecordProps = {
    data: RegisterData;
    isEntry: boolean
}

export function Record({ data, isEntry }: RecordProps) {
    const { theme } = useTheme()

    function getIconName() {
        switch (data.type) {
            case 'trabalho':
                return isEntry ? 'login' : 'logout'
            case 'folga':
                return 'beach-access'
            default:
                return 'medical-services'
        }
    }
    function getTimeText() {
        switch (data.type) {
            case 'trabalho':
                return convertMinutesToTime(data.timeInMinutes || 0)
            case 'folga':
                return data.isFullDay ? 'Dia completo' : convertMinutesToTime(data.timeInMinutes || 0) || '0:00'
            default:
                return data.isFullDay ? 'Dia completo' : convertMinutesToTime(data.timeInMinutes || 0) || '0:00'
        }
    }

    function getDescriptionText() {
        switch (data.type) {
            case 'trabalho':
                return data.description || (isEntry ? 'Entrada' : 'Saída')
            case 'folga':
                return data.isFullDay ? 'Folga - dia todo' : `Folga - ${convertMinutesToTime(data.timeInMinutes || 0)} horas`
            default:
                return data.isFullDay ? 'Atestado - dia todo' : `Atestado - ${convertMinutesToTime(data.timeInMinutes || 0)} horas`
        }
    }

    return (
        <TouchableOpacity
            key={`record-${data.id}`}
            className="flex-row items-center p-3 mb-4 rounded-lg bg-secondary-focus active:opacity-80 justify-between"
            onPress={() => router.push(`/${data.id}`)}
        >
            <View
                className={`justify-center items-center w-12 h-12 rounded-xl bg-${isEntry ? 'success' : 'error'} opacity-80`}
            >
                <MaterialIcons
                    name={getIconName()}
                    size={24}
                    color={
                        isEntry ? colors[theme].successContent : colors[theme].errorContent
                    }
                />
            </View>
            <View className="flex-1 ml-4">
                <Text className="text-xl font-bold text-secondary-content">
                    {getTimeText()} - <Text className="text-base">
                        {getDescriptionText()}
                    </Text>
                </Text>

                {data.location && data.type !== 'trabalho' && (
                    <Text className="text-xs opacity-60 text-secondary-content mt-1">
                        {data.location}
                    </Text>
                )}
                {data.nsr && (
                    <Text className="text-xs opacity-60 text-secondary-content mt-1">
                        NSR: {data.nsr}
                    </Text>
                )}
            </View>
            <MaterialIcons
                name="edit"
                size={20}
                color={colors[theme].secondaryContent}
                style={{ opacity: 0.6 }}
            />
        </TouchableOpacity>
    )
}