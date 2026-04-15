import React, { memo } from 'react';
import { StyleSheet, TextInput, View } from 'react-native';

import { colors, radius, spacing, typography } from '../theme';

type InputTextRowProps = {
  leftPlaceholder?: string;
  rightPlaceholder?: string;
};

export const InputTextRow = memo(function InputTextRow({
  leftPlaceholder = '\u0412\u0430\u0448 \u043a\u043e\u043c\u043c\u0435\u043d\u0442\u0430\u0440\u0438\u0439',
  rightPlaceholder = '\u0412\u0430\u0448 \u043a\u043e\u043c\u043c\u0435\u043d\u0442\u0430\u0440\u0438\u0439',
}: InputTextRowProps) {
  return (
    <View style={styles.row}>
      <TextInput placeholder={leftPlaceholder} placeholderTextColor={colors.textMuted} style={styles.input} />
      <TextInput placeholder={rightPlaceholder} placeholderTextColor={colors.textMuted} style={styles.input} />
    </View>
  );
});

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    gap: spacing.xs,
  },
  input: {
    ...typography.caption,
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: radius.sm,
    borderWidth: 1,
    flex: 1,
    minHeight: 34,
    paddingHorizontal: spacing.xs,
    paddingVertical: 6,
    color: colors.text,
  },
});

export type { InputTextRowProps };
