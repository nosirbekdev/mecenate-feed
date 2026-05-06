import React, { memo } from 'react';
import { StyleSheet, TextInput, View } from 'react-native';

import { colors, radius, spacing, typography } from '../theme';

type InputTextRowProps = {
  value: string;
  onChangeText: (value: string) => void;
  placeholder?: string;
  editable?: boolean;
  onSubmitEditing?: () => void;
};

export const InputTextRow = memo(function InputTextRow({
  value,
  onChangeText,
  placeholder = '\u0412\u0430\u0448 \u043a\u043e\u043c\u043c\u0435\u043d\u0442\u0430\u0440\u0438\u0439',
  editable = true,
  onSubmitEditing,
}: InputTextRowProps) {
  return (
    <View style={styles.row}>
      <TextInput
        editable={editable}
        onChangeText={onChangeText}
        onSubmitEditing={onSubmitEditing}
        placeholder={placeholder}
        placeholderTextColor={colors.textMuted}
        returnKeyType="send"
        style={styles.input}
        value={value}
      />
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
