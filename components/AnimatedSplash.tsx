import React, { useEffect } from 'react';
import { View, StyleSheet, Text, Image } from 'react-native';
import Animated, {
    useSharedValue,
    useAnimatedStyle,
    withTiming,
    withSequence,
    withDelay,
    runOnJS,
    FadeOut
} from 'react-native-reanimated';
import { useFonts, Inter_700Bold } from '@expo-google-fonts/inter';

export default function AnimatedSplash({ onAnimationFinish }: { onAnimationFinish: () => void }) {
    const scale = useSharedValue(0.8);
    const opacity = useSharedValue(0);
    const textOpacity = useSharedValue(0);

    useEffect(() => {
        // Start animations
        scale.value = withSequence(
            withTiming(1.0, { duration: 800 }),
            withTiming(1.05, { duration: 1000 }), // Breathing effect
            withTiming(1.0, { duration: 800 })
        );

        opacity.value = withTiming(1, { duration: 800 });

        // Text fades in slightly later
        textOpacity.value = withDelay(500, withTiming(1, { duration: 800 }));

        // Finish after 2.5 seconds
        const timeout = setTimeout(() => {
            onAnimationFinish();
        }, 2500);

        return () => clearTimeout(timeout);
    }, []);

    const animatedLogoStyle = useAnimatedStyle(() => {
        return {
            transform: [{ scale: scale.value }],
            opacity: opacity.value,
        };
    });

    const animatedTextStyle = useAnimatedStyle(() => {
        return {
            opacity: textOpacity.value,
        };
    });

    return (
        <Animated.View exiting={FadeOut.duration(800)} style={styles.container}>
            <Animated.Image
                source={require('../assets/images/icon.png')}
                style={[styles.logo, animatedLogoStyle]}
                resizeMode="contain"
            />
            <Animated.Text style={[styles.text, animatedTextStyle]}>
                Pozoo Do Kinoingan
            </Animated.Text>
        </Animated.View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#2B5937', // Green background
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 9999, // Ensure it sits on top
        ...StyleSheet.absoluteFillObject,
    },
    logo: {
        width: 150,
        height: 150,
        marginBottom: 20,
    },
    text: {
        fontSize: 24,
        color: '#FFFFFF',
        fontFamily: 'Inter-Bold',
        fontWeight: 'bold',
        letterSpacing: 1,
    },
});
