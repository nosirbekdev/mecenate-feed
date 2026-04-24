import type { ViewStyle } from "react-native";

const card: ViewStyle = {
  shadowColor: "#0F172A",
  shadowOpacity: 0.03,
  shadowRadius: 6,
  shadowOffset: { width: 0, height: 2 },
  elevation: 1,
};

export const shadows = {
  card,
} as const;
