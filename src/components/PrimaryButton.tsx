import React, { memo } from 'react';
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  type PressableProps,
  type PressableStateCallbackType,
  type StyleProp,
  type ViewStyle,
} from 'react-native';

import { colors, radius, spacing, typography } from '../theme';

type PrimaryButtonProps = PressableProps & {
  title: string;
  loading?: boolean;
  fullWidth?: boolean;
  size?: 'sm' | 'md';
};

export const PrimaryButton = memo(function PrimaryButton({
  title,
  loading = false,
  fullWidth = false,
  size = 'md',
  disabled,
  style,
  ...props
}: PrimaryButtonProps) {
  const isDisabled = Boolean(disabled || loading);

  const resolveStyle = (state: PressableStateCallbackType): StyleProp<ViewStyle> => {
    const userStyle = typeof style === 'function' ? style(state) : style;

    return [
      styles.button,
      size === 'sm' ? styles.buttonSm : styles.buttonMd,
      fullWidth && styles.fullWidth,
      isDisabled && styles.disabled,
      state.pressed && !isDisabled && styles.pressed,
      userStyle,
    ];
  };

  return (
    <Pressable disabled={isDisabled} style={resolveStyle} {...props}>
      {loading ? (
        <ActivityIndicator size="small" color={colors.surface} />
      ) : (
        <Text style={styles.label}>{title}</Text>
      )}
    </Pressable>
  );
});

const styles = StyleSheet.create({
  button: {
    alignItems: 'center',
    backgroundColor: colors.purple,
    borderRadius: radius.pill,
    justifyContent: 'center',
    paddingHorizontal: spacing.lg,
  },
  buttonSm: {
    minHeight: 32,
    paddingVertical: spacing.xs,
  },
  buttonMd: {
    minHeight: 40,
    paddingVertical: spacing.sm,
  },
  fullWidth: {
    width: '100%',
  },
  disabled: {
    opacity: 0.55,
  },
  pressed: {
    opacity: 0.88,
  },
  label: {
    ...typography.button,
    color: colors.surface,
  },
});

export type { PrimaryButtonProps };
