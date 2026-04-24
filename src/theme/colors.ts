export const colors = {
  bg: "#FFFFFF",
  surface: "#FFFFFF",
  surfaceMuted: "#FAFAFA",
  surfaceElevated: "#FFFFFF",
  border: "#EFEFF0",
  borderStrong: "#DDDFF0",
  text: "#12131A",
  textMuted: "#6E7280",
  purple: "#7C3AED",
  purpleSoft: "#F1EAFF",
  purpleDeep: "#5B21B6",
  roseSoft: "#FDECF3",
  success: "#16A34A",
  danger: "#DC2626",
  overlay: "rgba(17, 24, 39, 0.45)",
  skeletonBase: "#ECEEF3",
  skeletonHighlight: "#F5F7FB",
} as const;

export type AppColors = typeof colors;
