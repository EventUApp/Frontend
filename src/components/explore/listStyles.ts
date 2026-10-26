import { StyleSheet } from 'react-native';
import { Spacing } from '../../theme';
import { SCROLL_BOTTOM_PADDING } from '../../constants/layout';

/** Contenido compartido por las tres listas del marketplace. */
export const listStyles = StyleSheet.create({
  listContent: {
    padding: Spacing.lg,
    paddingBottom: SCROLL_BOTTOM_PADDING,
    flexGrow: 1,
  },
});
