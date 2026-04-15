import type { ViewStyle } from "react-native";

const card: ViewStyle = {
  shadowColor: "#0F172A",
  shadowOpacity: 0.08,
  shadowRadius: 10,
  shadowOffset: { width: 0, height: 4 },
  elevation: 2,
};

export const shadows = {
  card,
} as const;
