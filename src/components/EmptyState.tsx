import { Ionicons } from '@expo/vector-icons';
import React, { memo } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { colors, spacing, typography } from '../theme';
import { PrimaryButton } from './PrimaryButton';

type EmptyStateProps = {
  title?: string;
  message?: string;
  ctaLabel?: string;
  onPressCta?: () => void;
};

export const EmptyState = memo(function EmptyState({
  title = '\u041f\u043e \u0432\u0430\u0448\u0435\u043c\u0443 \u0437\u0430\u043f\u0440\u043e\u0441\u0443 \u043d\u0438\u0447\u0435\u0433\u043e \u043d\u0435 \u043d\u0430\u0439\u0434\u0435\u043d\u043e',
  message = '',
  ctaLabel = '\u041d\u0430 \u0433\u043b\u0430\u0432\u043d\u0443\u044e',
  onPressCta,
}: EmptyStateProps) {
  return (
    <View style={styles.container}>
      <View style={styles.illWrap}>
        <Ionicons name="sad-outline" size={38} color={colors.purple} />
      </View>
      <Text style={styles.title}>{title}</Text>
      {message ? <Text style={styles.message}>{message}</Text> : null}
      <PrimaryButton title={ctaLabel} onPress={onPressCta} fullWidth size="sm" />
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
  title: {
    ...typography.bodyMedium,
    color: colors.text,
    marginBottom: spacing.sm,
    textAlign: 'center',
  },
  message: {
    ...typography.body,
    color: colors.textMuted,
    marginBottom: spacing.sm,
    textAlign: 'center',
  },
});

export type { EmptyStateProps };
