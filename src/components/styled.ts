/**
 * NativeWind v5 só aplica `className` em componentes do React Native.
 * Componentes de terceiros precisam de um wrapper `styled` explícito.
 */
import { styled } from "nativewind";
import { LinearGradient as ExpoLinearGradient } from "expo-linear-gradient";
import { Link as ExpoLink } from "expo-router";
import { SafeAreaView as RNSafeAreaView } from "react-native-safe-area-context";

export const SafeAreaView = styled(RNSafeAreaView, { className: "style" });
export const Link = styled(ExpoLink, { className: "style" });
export const LinearGradient = styled(ExpoLinearGradient, { className: "style" });
