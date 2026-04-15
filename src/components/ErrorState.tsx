import { Ionicons } from '@expo/vector-icons';
import React, { memo } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { colors, spacing, typography } from '../theme';
import { PrimaryButton } from './PrimaryButton';

type ErrorStateProps = {
  title?: string;
  message?: string;
  retryLabel?: string;
  onRetry?: () => void;
};

export const ErrorState = memo(function ErrorState({
  message = '\u041d\u0435 \u0443\u0434\u0430\u043b\u043e\u0441\u044c \u0437\u0430\u0433\u0440\u0443\u0437\u0438\u0442\u044c \u043f\u0443\u0431\u043b\u0438\u043a\u0430\u0446\u0438\u0438',
  retryLabel = '\u041f\u043e\u0432\u0442\u043e\u0440\u0438\u0442\u044c',
  onRetry,
}: ErrorStateProps) {
  return (
    <View style={styles.container}>
      <View style={styles.illWrap}>
        <Ionicons name="sad-outline" size={38} color={colors.purple} />
      </View>
      <Text style={styles.message}>{message}</Text>
      {onRetry ? <PrimaryButton title={retryLabel} onPress={onRetry} fullWidth size="sm" /> : null}
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
    padding: spacing.xl,
  },
  illWrap: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.sm,
  },
  message: {
    ...typography.bodyMedium,
    color: colors.text,
    marginBottom: spacing.sm,
    textAlign: 'center',
  },
});

export type { ErrorStateProps };
