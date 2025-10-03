import DateTimePicker from "@react-native-community/datetimepicker";
import { useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";

interface Props {
  mode: "date" | "time";
  onChange: (text: Date) => void;
  value: Date;
}

export function DateInput({ mode, onChange, value }: Props) {
  const [showDatePicker, setShowDatePicker] = useState(false);

  return (
    <View>
      <TouchableOpacity
        onPress={() => setShowDatePicker(true)}
        className="p-2 rounded-md bg-surface"
      >
        <Text className="text-surface-content">
          {mode === "date"
            ? value.toLocaleDateString("pt-BR")
            : value.toLocaleTimeString("pt-BR", {
              hour: "2-digit",
              minute: "2-digit",
            })}
        </Text>
      </TouchableOpacity>
      {showDatePicker && (
        <DateTimePicker
          value={value}
          mode={mode}
          is24Hour={true}
          onChange={(event, date) => {
            if (date) {
              onChange(date);
            }
            setShowDatePicker(false);
          }}
        />
      )}
    </View>
  );
}
