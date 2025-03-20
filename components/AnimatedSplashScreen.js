import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated, Dimensions, Text } from 'react-native';
import { SplashIcon } from '../assets/images/splash';

const { width, height } = Dimensions.get('window');

export const AnimatedSplashScreen = ({ onAnimationComplete }) => {
  // Nilai animasi - kurangkan jumlah animasi
  const scaleAnim = useRef(new Animated.Value(0.2)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;
  const textOpacityAnim = useRef(new Animated.Value(0)).current;
  
  useEffect(() => {
    // Urutan animasi utama - lebih ringkas dan pantas
    Animated.sequence([
      // Muncul dan skala (parallel)
      Animated.parallel([
        Animated.timing(opacityAnim, {
          toValue: 1,
          duration: 500, // Lebih cepat
          useNativeDriver: true,
        }),
        Animated.spring(scaleAnim, {
          toValue: 1,
          friction: 5,
          tension: 40,
          useNativeDriver: true,
        }),
      ]),
      
      // Tunjukkan teks
      Animated.timing(textOpacityAnim, {
        toValue: 1,
        duration: 500, // Lebih cepat
        useNativeDriver: true,
      }),
      
      // Tunggu - kurangkan masa menunggu
      Animated.delay(800),
      
      // Hilang
      Animated.parallel([
        Animated.timing(opacityAnim, {
          toValue: 0,
          duration: 500, // Lebih cepat
          useNativeDriver: true,
        }),
        Animated.timing(textOpacityAnim, {
          toValue: 0,
          duration: 300, // Lebih cepat
          useNativeDriver: true,
        }),
      ]),
    ]).start(() => {
      if (onAnimationComplete) {
        onAnimationComplete();
      }
    });
  }, []);
  
  // Kurangkan saiz ikon
  const iconSize = Math.min(width, height) * 0.4;
  
  return (
    <View style={styles.container}>
      {/* Buang efek cahaya dan glow */}
      
      {/* Ikon utama */}
      <Animated.View
        style={[
          styles.iconContainer,
          {
            opacity: opacityAnim,
            transform: [
              { scale: scaleAnim },
            ],
          },
        ]}
      >
        <SplashIcon width={iconSize} height={iconSize} />
      </Animated.View>
      
      {/* Teks */}
      <Animated.View style={[styles.textContainer, { opacity: textOpacityAnim }]}>
        <Text style={styles.appName}>BUKU LAGU POZOO</Text>
        <Text style={styles.appSubtitle}>Aplikasi Nyanyian Rohani</Text>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#1C3D23',
  },
  iconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  textContainer: {
    marginTop: 20,
    alignItems: 'center',
  },
  appName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textAlign: 'center',
  },
  appSubtitle: {
    fontSize: 16,
    color: '#FFFFFF',
    opacity: 0.8,
    marginTop: 8,
    textAlign: 'center',
  },
}); 