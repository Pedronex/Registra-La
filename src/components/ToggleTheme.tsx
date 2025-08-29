import { useTheme } from "@/providers/ThemeProvider";
import { colors } from "@/utils/colorThemes";
import Feather from "@expo/vector-icons/Feather";
import { useEffect } from "react";
import { Pressable, View } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";

const ThemeToggle = () => {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === "dark";
  const translateX = useSharedValue(isDark ? 46 : 3.5);

  useEffect(() => {
    translateX.value = withSpring(isDark ? 46 : 3.5, {
      damping: 15,
      stiffness: 150,
    });
  }, [isDark, translateX]);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: translateX.value }],
    };
  });

  return (
    <Pressable
      onPress={toggleTheme}
      className="relative flex-row justify-between items-center p-1 w-24 h-12 rounded-full bg-secondary"
    >
      <Icon icon="sun" />
      <Icon icon="moon" />
      <Animated.View
        style={[animatedStyle]}
        className="flex absolute flex-row justify-center items-center w-10 h-10 rounded-full bg-background"
      />
    </Pressable>
  );
};

const Icon = (props: any) => {
  const { theme } = useTheme();

  return (
    <View className="flex relative z-50 flex-row justify-center items-center w-10 h-10 rounded-full">
      <Feather
        name={props.icon}
        size={20}
        color={colors[theme].backgroundColor}
      />
    </View>
  );
};

export default ThemeToggle;
