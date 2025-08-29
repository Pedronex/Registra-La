import { useTheme } from "@/providers/ThemeProvider";
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
    onChange(`${formattedHours}:${formattedMinutes}`);
  };

  const { theme } = useTheme();

  return (
    <View className="flex-row gap-x-4 justify-between items-center w-full rounded-lg">
      <TouchableOpacity
        className="justify-center items-center mr-2 rounded-full border border-tertiary"
        onPress={handleAddMinutes}
      >
        <Entypo
          name="plus"
          size={50}
          color={theme === "light" ? "#7D5260" : "#EFB8C8"}
        />
      </TouchableOpacity>
      <TextInput
        className="text-4xl text-tertiary"
        value={hours}
        onChangeText={handleHourChange}
        onBlur={handleHourBlur}
      />
      <Text className="text-4xl font-bold text-tertiary">:</Text>

      <TextInput
        className="text-4xl text-tertiary"
        value={minutes}
        onChangeText={handleMinuteChange}
        onBlur={handleMinuteBlur}
      />
      <TouchableOpacity
        className="justify-center items-center mr-2 rounded-full border border-tertiary"
        onPress={handleRemoveMinute}
      >
        <Entypo
          name="minus"
          size={50}
          color={theme === "light" ? "#7D5260" : "#EFB8C8"}
        />
      </TouchableOpacity>
    </View>
  );
}
