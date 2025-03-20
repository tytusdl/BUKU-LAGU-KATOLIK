import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated, Dimensions } from 'react-native';
import { SplashIcon } from '../assets/images/splash';

const { width, height } = Dimensions.get('window');

export const SplashScreen = ({ onAnimationComplete }) => {
  const scaleAnim = useRef(new Animated.Value(0.3)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;
  const rotateAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Urutan animasi
    Animated.sequence([
      // Muncul
      Animated.timing(opacityAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      // Putaran dan skala
      Animated.parallel([
        Animated.timing(scaleAnim, {
          toValue: 1,
          duration: 1200,
          useNativeDriver: true,
        }),
        Animated.timing(rotateAnim, {
          toValue: 1,
          duration: 1200,
          useNativeDriver: true,
        }),
      ]),
      // Tunggu sebentar
      Animated.delay(500),
      // Hilang
      Animated.timing(opacityAnim, {
        toValue: 0,
        duration: 800,
        useNativeDriver: true,
      }),
    ]).start(() => {
      // Panggil callback setelah animasi selesai
      if (onAnimationComplete) {
        onAnimationComplete();
      }
    });
  }, [scaleAnim, opacityAnim, rotateAnim, onAnimationComplete]);

  // Transformasi rotasi untuk animasi
  const rotate = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  const iconSize = Math.min(width, height) * 0.7;

  return (
    <View style={styles.container}>
      <Animated.View
        style={[
          styles.iconContainer,
          {
            opacity: opacityAnim,
            transform: [
              { scale: scaleAnim },
              { rotate: rotate }
            ],
          },
        ]}
      >
        <SplashIcon width={iconSize} height={iconSize} />
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#1C3D23',
  },
  iconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
}); 