import React, { memo } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { colors, spacing, typography } from '../theme';
import { Avatar } from './Avatar';

type CommentPreviewProps = {
  authorName: string;
  text: string;
};

export const CommentPreview = memo(function CommentPreview({ authorName, text }: CommentPreviewProps) {
  return (
    <View style={styles.row}>
      <Avatar name={authorName} size={22} />
      <View style={styles.body}>
        <Text style={styles.author} numberOfLines={1}>
          {authorName}
        </Text>
        <Text style={styles.text} numberOfLines={1}>
          {text}
        </Text>
      </View>
    </View>
  );
});

const styles = StyleSheet.create({
  row: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: spacing.xs,
  },
  body: {
    flex: 1,
  },
  author: {
    ...typography.caption,
    color: colors.text,
    fontWeight: '600',
  },
  text: {
    ...typography.caption,
    color: colors.textMuted,
  },
});

export type { CommentPreviewProps };
