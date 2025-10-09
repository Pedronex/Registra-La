import DateTimePicker from "@react-native-community/datetimepicker";
import { useEffect, useRef, useState } from "react";
import { Text, TextInput, TouchableOpacity, View } from "react-native";

interface BalanceInputProps {
    onChange: (hours: string, minutes: string, date: Date, operation: "increase" | "decrease") => void;
    value: {
        hours: string;
        minutes: string;
        date: Date;
        operation: "increase" | "decrease";
    };
}

export function BalanceInput({ onChange, value }: BalanceInputProps) {
    const [operation, setOperation] = useState<"increase" | "decrease">("increase");
    const [date, setDate] = useState<Date>(value.date);
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [hours, setHours] = useState<string>(value.hours || "00");
    const [minutes, setMinutes] = useState<string>(value.minutes || "00");

    // Refs para os campos de horas e minutos
    const hoursRef = useRef<TextInput>(null);
    const minutesRef = useRef<TextInput>(null);

    useEffect(() => {
        onChange(hours, minutes, date, operation);
    }, [operation, date, hours, minutes, onChange])

    const handleDateChange = (_event: any, selectedDate?: Date) => {
        setShowDatePicker(false);
        if (selectedDate)
            setDate(selectedDate);

    };

    // Ao preencher 2 dígitos nas horas, foca nos minutos
    const handleHoursChange = (text: string) => {
        const sanitized = text.replace(/[^0-9]/g, "").slice(0, 2);
        setHours(sanitized);
        if (sanitized.length === 2) {
            minutesRef.current?.focus();
        }
    };

    // Ao apagar tudo dos minutos, foca nas horas
    const handleMinutesChange = (text: string) => {
        const sanitized = text.replace(/[^0-9]/g, "").slice(0, 2);
        setMinutes(sanitized);
        if (sanitized.length === 0) {
            hoursRef.current?.focus();
        }
    };

    return (
        <View className="w-full bg-surface rounded-xl p-4">
            <Text className="text-lg font-semibold text-background-content mb-4">Ajustar saldo</Text>
            <View className="flex-row mb-4">
                <TouchableOpacity
                    className={`flex-1 items-center py-2 rounded-lg mr-2 border ${operation === "increase" ? "bg-primary border-primary" : "bg-surface border-surface-content"}`}
                    onPress={() => setOperation("increase")}
                >
                    <Text className={`text-base font-medium ${operation === "increase" ? "text-primary-content" : "text-surface-content"}`}>Aumentar</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    className={`flex-1 items-center py-2 rounded-lg ml-2 border ${operation === "decrease" ? "bg-primary border-primary" : "bg-surface border-surface-content"}`}
                    onPress={() => setOperation("decrease")}
                >
                    <Text className={`text-base font-medium ${operation === "decrease" ? "text-primary-content" : "text-surface-content"}`}>Diminuir</Text>
                </TouchableOpacity>
            </View>

            <View className="mb-4">
                <Text className="text-base font-medium text-background-content mb-1">A partir de:</Text>
                <TouchableOpacity
                    className="px-4 py-2 rounded-lg bg-surface border border-surface-content"
                    onPress={() => setShowDatePicker(true)}
                >
                    <Text className="text-base text-surface-content">
                        {date.toLocaleDateString()}
                    </Text>
                </TouchableOpacity>
                {showDatePicker && (
                    <DateTimePicker
                        value={date}
                        mode="date"
                        display="default"
                        onChange={handleDateChange}
                    />
                )}
            </View>

            <View>
                <Text className="text-base font-medium text-background-content mb-1">Quantidade:</Text>
                <View className="flex-row items-center">
                    <TextInput
                        ref={hoursRef}
                        className="w-12 h-12 text-center text-lg font-bold bg-surface border border-surface-content rounded-lg text-surface-content"
                        keyboardType="number-pad"
                        maxLength={2}
                        value={hours}
                        onChangeText={handleHoursChange}
                        placeholder="00"
                        placeholderTextColor="#A0A0A0"
                        returnKeyType="next"
                        blurOnSubmit={false}
                        onSubmitEditing={() => minutesRef.current?.focus()}
                    />
                    <Text className="mx-2 text-lg font-bold text-surface-content">:</Text>
                    <TextInput
                        ref={minutesRef}
                        className="w-12 h-12 text-center text-lg font-bold bg-surface border border-surface-content rounded-lg text-surface-content"
                        keyboardType="number-pad"
                        maxLength={2}
                        value={minutes}
                        onChangeText={handleMinutesChange}
                        placeholder="00"
                        placeholderTextColor="#A0A0A0"
                        returnKeyType="done"
                    />
                    <Text className="ml-2 text-lg font-bold text-surface-content">h</Text>
                </View>
            </View>
        </View>
    );
}