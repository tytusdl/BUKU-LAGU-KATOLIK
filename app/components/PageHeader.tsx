import React, { ReactNode } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ViewStyle,
  Animated,
  NativeSyntheticEvent,
  NativeScrollEvent,
} from 'react-native';
import { useTheme } from '../context/ThemeContext';

interface PageHeaderProps {
  /** Big title — e.g. "Favorite Songs" / "Song List" / "Settings". */
  title: string;
  /** Description text rendered below the title. */
  subtitle?: string;
  style?: ViewStyle;
  /** Optional right-side action buttons (e.g. share, clear). */
  rightActions?: ReactNode;
  /**
   * If provided, the header animates based on the parent ScrollView's Y
   * offset: title shrinks, subtitle fades, container compresses. Header
   * stays sticky at the top of the screen.
   *
   * Pass the same Animated.Value you feed to the ScrollView's onScroll
   * (e.g. `const scrollY = useRef(new Animated.Value(0)).current;` then
   * `onScroll={Animated.event(...)}`).
   */
  scrollY?: Animated.Value;
  /** Pixels of scroll needed to fully condense. Default 80. */
  condenseDistance?: number;
}

// Title color per theme — gives each page a distinct identity.
const THEME_TITLE_COLORS: Record<string, string> = {
  white:  '#0A0A0A',
  blue:   '#0F1F3D',
  green:  '#0F2418',
  purple: '#241038',
  pink:   '#3D0F26',
  orange: '#3D1A0A',
  red:    '#3D0F0F',
  // All dark-mode variants are pure white so the title is always
  // readable on the dark background, regardless of the user's color theme.
  dark_white:  '#FFFFFF',
  dark_blue:   '#FFFFFF',
  dark_green:  '#FFFFFF',
  dark_purple: '#FFFFFF',
  dark_pink:   '#FFFFFF',
  dark_orange: '#FFFFFF',
  dark_red:    '#FFFFFF',
};

export default function PageHeader({
  title,
  subtitle,
  style,
  rightActions,
  scrollY,
  condenseDistance = 80,
}: PageHeaderProps) {
  const { isDarkMode, colorThemeId, currentColorTheme } = useTheme();

  const themeKey = isDarkMode ? `dark_${colorThemeId}` : colorThemeId;
  const titleColor = THEME_TITLE_COLORS[themeKey] || THEME_TITLE_COLORS[colorThemeId] || THEME_TITLE_COLORS.white;

  const subtitleColor = isDarkMode
    ? '#C8C8C8'
    : '#5A5A5A';

  // When scrollY is provided, derive animation values 0..1 where 0 = full
  // expanded header, 1 = fully condensed. Otherwise stay at 0 (expanded).
  // The condense range is gentle: title stays readable at condensed size,
  // subtitle fades but doesn't collapse to zero height abruptly.
  const condenseProgress = scrollY
    ? scrollY.interpolate({
        inputRange: [0, condenseDistance],
        outputRange: [0, 1],
        extrapolate: 'clamp',
      })
    : new Animated.Value(0);

  // Title font size shrinks from 18 → 16 (still readable when condensed)
  const titleFontSize = condenseProgress.interpolate({
    inputRange: [0, 1],
    outputRange: [18, 16],
    extrapolate: 'clamp',
  });

  // Title line height shrinks proportionally
  const titleLineHeight = condenseProgress.interpolate({
    inputRange: [0, 1],
    outputRange: [24, 20],
    extrapolate: 'clamp',
  });

  // Title bottom margin shrinks
  const titleMarginBottom = condenseProgress.interpolate({
    inputRange: [0, 1],
    outputRange: [4, 0],
    extrapolate: 'clamp',
  });

  // Subtitle fades but never fully disappears — leave a faint hint visible
  // so the page never feels like the header has vanished.
  const subtitleOpacity = condenseProgress.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [1, 0.5, 0],
    extrapolate: 'clamp',
  });
  const subtitleMaxHeight = condenseProgress.interpolate({
    inputRange: [0, 1],
    outputRange: [40, 0],
    extrapolate: 'clamp',
  });

  // Container vertical padding shrinks gently
  const containerPaddingTop = condenseProgress.interpolate({
    inputRange: [0, 1],
    outputRange: [8, 4],
    extrapolate: 'clamp',
  });
  const containerPaddingBottom = condenseProgress.interpolate({
    inputRange: [0, 1],
    outputRange: [14, 8],
    extrapolate: 'clamp',
  });

  return (
    <Animated.View
      style={[
        styles.container,
        style,
        {
          paddingTop: containerPaddingTop,
          paddingBottom: containerPaddingBottom,
        },
      ]}
    >
      <View style={styles.titleRow}>
        <Animated.Text
          style={[
            styles.title,
            {
              color: titleColor,
              flex: 1,
              fontSize: titleFontSize,
              lineHeight: titleLineHeight,
              marginBottom: titleMarginBottom,
            },
          ]}
          numberOfLines={1}
          adjustsFontSizeToFit
          minimumFontScale={0.7}
          maxFontSizeMultiplier={1.1}
        >
          {title.toUpperCase()}
        </Animated.Text>

        {rightActions && (
          <View style={styles.actionsContainer}>{rightActions}</View>
        )}
      </View>

      {subtitle && (
        <Animated.View
          style={{
            opacity: subtitleOpacity,
            maxHeight: subtitleMaxHeight,
            overflow: 'hidden',
          }}
        >
          <Text
            style={[styles.subtitle, { color: subtitleColor }]}
            numberOfLines={2}
            maxFontSizeMultiplier={1.2}
          >
            {subtitle}
          </Text>
        </Animated.View>
      )}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    paddingHorizontal: 20,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: 32,
  },
  title: {
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  actionsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 32,
  },
  subtitle: {
    fontSize: 13,
    lineHeight: 19,
    fontFamily: 'Inter-Regular',
  },
});
