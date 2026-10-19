import { Alert } from "@/lib/Alert";
import { themes } from "@/utils/colorThemes";
import { VariableContextProvider } from "nativewind";
import type React from "react";
import { createContext, useContext, useState } from "react";
import { Appearance, useColorScheme, View } from "react-native";

interface ThemeProviderProps {
  children: React.ReactNode;
}

type ThemeContextType = {
  theme: "light" | "dark";
  toggleTheme: () => void;
};

export const ThemeContext = createContext<ThemeContextType>({
  theme: "light",
  toggleTheme: () => { },
});

export const ThemeProvider = ({ children }: ThemeProviderProps) => {
  const colorSchemeNative = useColorScheme();

  const [currentTheme, setCurrentTheme] = useState<"light" | "dark">(
    colorSchemeNative === "dark" ? "dark" : "light",
  );

  const toggleTheme = () => {
    const newTheme = currentTheme === "light" ? "dark" : "light";
    setCurrentTheme(newTheme);
    Appearance.setColorScheme(newTheme);
  };

  return (
    <ThemeContext.Provider value={{ theme: currentTheme, toggleTheme }}>
      <VariableContextProvider value={themes[currentTheme]}>
        <View className="flex-1">{children}</View>
      </VariableContextProvider>
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    Alert.error("useTheme deve ser informado para o ThemeProvider");
  }
  return context;
};
