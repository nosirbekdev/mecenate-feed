import type { TextStyle } from "react-native";

export const fontFamily = {
  regular: "System",
  medium: "System",
  semibold: "System",
  bold: "System",
} as const;

export const typography = {
  h3: {
    fontSize: 18,
    lineHeight: 24,
    fontWeight: "700",
  } satisfies TextStyle,
  body: {
    fontSize: 14,
    lineHeight: 20,
    fontWeight: "400",
  } satisfies TextStyle,
  bodyMedium: {
    fontSize: 14,
    lineHeight: 20,
    fontWeight: "500",
  } satisfies TextStyle,
  caption: {
    fontSize: 12,
    lineHeight: 16,
    fontWeight: "400",
  } satisfies TextStyle,
  button: {
    fontSize: 14,
    lineHeight: 20,
    fontWeight: "700",
  } satisfies TextStyle,
} as const;

export type TypographyToken = keyof typeof typography;
