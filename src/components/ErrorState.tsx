import { Ionicons } from '@expo/vector-icons';
import React, { memo } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { FEED_ERROR_MESSAGE, RETRY_LABEL } from '../constants/messages';
import { colors, spacing, typography } from '../theme';
import { PrimaryButton } from './PrimaryButton';

type ErrorStateProps = {
  title?: string;
  message?: string;
  retryLabel?: string;
  onRetry?: () => void;
};

export const ErrorState = memo(function ErrorState({
  message = FEED_ERROR_MESSAGE,
  retryLabel = RETRY_LABEL,
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
