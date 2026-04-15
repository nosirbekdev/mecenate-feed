import { Ionicons } from '@expo/vector-icons';
import React, { memo } from 'react';
import { StyleSheet, Text, View, type ViewStyle } from 'react-native';

import { colors, radius, spacing, typography } from '../theme';
import { PrimaryButton } from './PrimaryButton';

let BlurViewFallback: React.ComponentType<any> | null = null;
try {
  BlurViewFallback = require('expo-blur').BlurView;
} catch {
  BlurViewFallback = null;
}

type PaidPostOverlayProps = {
  visible?: boolean;
  title?: string;
  description?: string;
  ctaText?: string;
  onPressSubscribe?: () => void;
  containerStyle?: ViewStyle;
};

export const PaidPostOverlay = memo(function PaidPostOverlay({
  visible = true,
  title = '\u041a\u043e\u043d\u0442\u0435\u043d\u0442 \u0441\u043a\u0440\u044b\u0442 \u043f\u043e\u043b\u044c\u0437\u043e\u0432\u0430\u0442\u0435\u043b\u0435\u043c',
  description = '\u0414\u043e\u0441\u0442\u0443\u043f \u043e\u0442\u043a\u0440\u043e\u0435\u0442\u0441\u044f \u043f\u043e\u0441\u043b\u0435 \u0434\u043e\u043d\u0430\u0442\u0430',
  ctaText = '\u041e\u0442\u043f\u0440\u0430\u0432\u0438\u0442\u044c \u0434\u043e\u043d\u0430\u0442',
  onPressSubscribe,
  containerStyle,
}: PaidPostOverlayProps) {
  if (!visible) return null;

  return (
    <View style={[styles.overlay, containerStyle]}>
      {BlurViewFallback ? (
        <BlurViewFallback intensity={20} tint="dark" style={StyleSheet.absoluteFillObject} />
      ) : null}
      <View style={styles.dimLayer} />

      <View style={styles.content}>
        <View style={styles.lockWrap}>
          <Ionicons name="lock-closed" size={14} color={colors.surface} />
        </View>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.description}>{description}</Text>
        <PrimaryButton title={ctaText} onPress={onPressSubscribe} fullWidth size="sm" />
      </View>
    </View>
  );
});

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    borderRadius: radius.lg,
    justifyContent: 'center',
    overflow: 'hidden',
  },
  dimLayer: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(22, 24, 33, 0.5)',
  },
  content: {
    alignItems: 'center',
    borderRadius: radius.md,
    marginHorizontal: spacing.md,
    padding: spacing.sm,
    width: '72%',
  },
  lockWrap: {
    alignItems: 'center',
    backgroundColor: colors.purple,
    borderRadius: 10,
    height: 20,
    justifyContent: 'center',
    width: 20,
  },
  title: {
    ...typography.caption,
    color: colors.surface,
    marginTop: spacing.xs,
    textAlign: 'center',
  },
  description: {
    ...typography.caption,
    color: 'rgba(255,255,255,0.85)',
    marginTop: 2,
    marginBottom: spacing.xs,
    textAlign: 'center',
  },
});

export type { PaidPostOverlayProps };
