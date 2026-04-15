export const colors = {
  bg: "#F4F5F8",
  surface: "#FFFFFF",
  surfaceMuted: "#F8F8FC",
  border: "#E8E9F0",
  text: "#12131A",
  textMuted: "#6E7280",
  purple: "#7C3AED",
  purpleSoft: "#F1EAFF",
  success: "#16A34A",
  danger: "#DC2626",
  overlay: "rgba(17, 24, 39, 0.45)",
  skeletonBase: "#ECEEF3",
  skeletonHighlight: "#F5F7FB",
} as const;

export type AppColors = typeof colors;
