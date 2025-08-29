import { useTheme } from "@/providers/ThemeProvider";
import { colors } from "@/utils/colorThemes";
import { Entypo } from "@expo/vector-icons";
import { useEffect, useState } from "react";
import { Text, TextInput, TouchableOpacity, View } from "react-native";

interface HourInputProps {
  onChange: (hour: string) => void;
  value: string;
}

export function HourInput({ onChange, value }: HourInputProps) {
  const [minutes, setMinutes] = useState("");
  const [hours, setHours] = useState("");
  const { theme } = useTheme();

  const isDark = theme === "dark";

  useEffect(() => {
    const [hour, minute] = value.split(":");
    setHours(hour);
    setMinutes(minute);
  }, [value]);

  const handleHourChange = (text: string) => {
    const val = text.replace(/[^0-9]/g, "");
    if (val.length <= 2) {
      setHours(val);
      onChange(`${val}:${minutes}`);
    }
  };

  const handleMinuteChange = (text: string) => {
    const val = text.replace(/[^0-9]/g, "");
    if (val.length <= 2) {
      setMinutes(val);
      onChange(`${hours}:${val}`);
    }
  };

  const handleMinuteBlur = () => {
    let num = parseInt(minutes, 10);
    if (isNaN(num)) num = 0;
    if (num < 0) num = 0;
    if (num > 59) num = 59;
    setMinutes(String(num).padStart(2, "0"));
  };

  const handleHourBlur = () => {
    let num = parseInt(hours, 10);
    if (isNaN(num)) num = 0;
    if (num < 0) num = 0;
    if (num > 23) num = 23;
    setHours(String(num).padStart(2, "0"));
  };

  const handleAddMinutes = () => {
    const currentHours = parseInt(hours) || 0;
    const currentMinutes = parseInt(minutes) || 0;

    let newMinutes = currentMinutes + 1;
    let newHours = currentHours;

    if (newMinutes >= 60) {
      newMinutes = 0;
      newHours = (newHours + 1) % 24;
    }

    const formattedHours = newHours.toString().padStart(2, "0");
    const formattedMinutes = newMinutes.toString().padStart(2, "0");

    setHours(formattedHours);
    setMinutes(formattedMinutes);
    onChange(`${formattedHours}:${formattedMinutes}`);
  };

  const handleRemoveMinute = () => {
    const currentHours = parseInt(hours) || 0;
    const currentMinutes = parseInt(minutes) || 0;

    let newMinutes = currentMinutes;
    let newHours = currentHours;

    if (currentMinutes === 0) {
      newMinutes = 59;
      newHours = currentHours - 1;
      if (newHours < 0) {
        newHours = 23;
      }
    } else {
      newMinutes = currentMinutes - 1;
    }

    const formattedHours = newHours.toString().padStart(2, "0");
    const formattedMinutes = newMinutes.toString().padStart(2, "0");

    setHours(formattedHours);
    setMinutes(formattedMinutes);
    onChange(`${formattedHours || "00"}:${formattedMinutes || "00"}`);
  };

  return (
    <View className="flex-row gap-x-4 justify-between items-center p-4 w-full rounded-2xl bg-surface elevation">
      <TouchableOpacity
        className="justify-center items-center w-14 h-14 rounded-full border bg-tertiary border-primary"
        onPress={handleAddMinutes}
      >
        <Entypo name="plus" size={32} color={colors[theme].surfaceContent}/>
      </TouchableOpacity>

      <View className="flex-row items-center px-4 py-2 rounded-xl bg-surface/10">
        <TextInput
          className="text-5xl font-semibold min-w-[60px] text-center text-surface-content"
          value={hours}
          keyboardType="number-pad"
          onChangeText={handleHourChange}
          onBlur={handleHourBlur}
        />
        <Text className="mx-1 text-5xl font-bold text-surface-content">:</Text>
        <TextInput
          className="text-5xl font-semibold min-w-[60px] text-center text-surface-content"
          value={minutes}
          keyboardType="number-pad"
          onChangeText={handleMinuteChange}
          onBlur={handleMinuteBlur}
        />
      </View>

      <TouchableOpacity
        className="justify-center items-center w-14 h-14 rounded-full border bg-tertiary border-primary"
        onPress={handleRemoveMinute}
      >
        <Entypo name="minus" size={32} color={colors[theme].surfaceContent} />
      </TouchableOpacity>
    </View>
  );
}
