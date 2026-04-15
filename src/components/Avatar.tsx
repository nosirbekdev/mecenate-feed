import { Ionicons } from "@expo/vector-icons";
import React, { memo } from "react";
import { Image, StyleSheet, Text, View } from "react-native";
import { colors, radius, typography } from "../theme";

type AvatarProps = {
  size?: number;
  uri?: string | null;
  name?: string;
};

const getInitials = (name?: string) => {
  if (!name) return "U";
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase())
    .join("");
};

export const Avatar = memo(function Avatar({
  size = 40,
  uri,
  name,
}: AvatarProps) {
  if (uri) {
    return (
      <Image
        source={{ uri }}
        style={[styles.image, { width: size, height: size, borderRadius: size / 2 }]}
      />
    );
  }

  const initials = getInitials(name);

  return (
    <View
      style={[
        styles.fallback,
        { width: size, height: size, borderRadius: size / 2 },
      ]}
    >
      {name ? (
        <Text style={styles.initials}>{initials}</Text>
      ) : (
        <Ionicons name="person" size={size * 0.48} color={colors.textMuted} />
      )}
    </View>
  );
});

const styles = StyleSheet.create({
  image: {
    backgroundColor: colors.surfaceMuted,
  },
  fallback: {
    alignItems: "center",
    backgroundColor: colors.purpleSoft,
    borderWidth: 1,
    borderColor: colors.border,
    justifyContent: "center",
  },
  initials: {
    ...typography.bodyMedium,
    color: colors.purple,
  },
});

export type { AvatarProps };
