import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Text, Dimensions, Platform, Image } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Animated, {
    useSharedValue,
    useAnimatedStyle,
    withTiming,
    withSpring,
    withRepeat,
    withSequence,
    withDelay,
    Easing,
    runOnJS,
    cancelAnimation,
    FadeOut,
    interpolate,
    Extrapolation,
} from 'react-native-reanimated';
import Svg, { Defs, LinearGradient, Stop, Rect } from 'react-native-svg';

const { width: SCREEN_W, height: SCREEN_H } = Dimensions.get('window');
const BAR_WIDTH = Math.min(SCREEN_W * 0.62, 260);
const BAR_HEIGHT = 6;
const BAR_RADIUS = BAR_HEIGHT / 2;

// Total splash duration — long enough that the user actually sees the bar
// fill from 0 → 100% instead of the splash vanishing mid-progress.
const SPLASH_DURATION_MS = 4000;

// --- Starfield config ---
// We pre-generate positions once at module load (deterministic via index)
// so the splash looks identical across runs and the layout doesn't shift
// between renders. Each particle has a different size, vertical travel,
// and twinkle delay to feel natural.
const PARTICLE_COUNT = 36;
// First `HERO_COUNT` particles are placed *near the logo* and rendered
// larger+brighter as visual anchors; the rest form a calm diffuse dust
// around the rest of the screen.
const HERO_COUNT = 8;

const PARTICLES = Array.from({ length: PARTICLE_COUNT }, (_, i) => {
    const r1 = Math.sin((i + 1) * 12.9898) * 43758.5453;
    const r2 = Math.sin((i + 1) * 78.233) * 43758.5453;
    const r3 = Math.sin((i + 1) * 31.7) * 43758.5453;
    const r4 = Math.sin((i + 1) * 53.123) * 43758.5453;

    const isHero = i < HERO_COUNT;

    let xFrac: number;
    let yFrac: number;
    let size: number;
    let maxOpacity: number;

    if (isHero) {
        // Anchor hero particles in a ring around the logo center
        // (vertical band 30–55%, horizontal across full width). Spread
        // evenly using angle `i / HERO_COUNT` so they look intentional.
        const angle = (i / HERO_COUNT) * Math.PI * 2 + 0.4;
        // Radial offset within ±35% horizontal, ±12% vertical from center.
        const rx = Math.cos(angle) * 0.32;
        const ry = Math.sin(angle) * 0.12;
        xFrac = 0.5 + rx;
        yFrac = 0.42 + ry; // logo sits around 42% vertical
        size = 5 + ((Math.abs(r4) * 10) % 3); // 5..7px
        maxOpacity = 0.85 + ((Math.abs(r4) * 10) % 2) * 0.10; // 0.85..0.95
    } else {
        const xRaw = (Math.abs(r1) % 1); // 0..1 horizontal
        // Bias away from the central logo column so the logo doesn't fight
        // with the dust for attention.
        xFrac = xRaw < 0.5
            ? xRaw * 0.85
            : 0.15 + (xRaw - 0.5) * 0.85;
        // Wider vertical spread — 15%..80%
        yFrac = 0.15 + (Math.abs(r2) % 1) * 0.65;
        // 2 size tiers — small accents mixed with medium dots for depth.
        const tier = (i - HERO_COUNT) % 4;
        size = tier === 0 ? 2 : tier === 1 ? 3 : tier === 2 ? 3 : 4;
        maxOpacity = 0.65 + ((i - HERO_COUNT) % 5) * 0.07; // 0.65..0.93
    }

    const twinklePhase = (Math.abs(r3) % 1);

    return {
        size,
        left: xFrac * SCREEN_W,
        top: yFrac * SCREEN_H,
        travelDuration: 3500 + ((i * 173) % 2500), // 3.5..6s per loop
        twinkleDuration: 1500 + ((i * 91) % 1800),  // 1.5..3.3s per twinkle
        twinklePhase,
        maxOpacity,
        isHero,
    };
});

interface ParticleProps {
    size: number;
    left: number;
    top: number;
    travelDuration: number;
    twinkleDuration: number;
    twinklePhase: number;
    maxOpacity: number;
    index: number;
}

function Particle({ size, left, top, travelDuration, twinkleDuration, twinklePhase, maxOpacity, index, isHero }: ParticleProps & { isHero?: boolean }) {
    // Float upward, then snap back below screen and repeat — gives the
    // impression of gentle continuous rise.
    const rise = useSharedValue(0);
    const twinkle = useSharedValue(twinklePhase);

    useEffect(() => {
        // Stagger each particle by its index so they don't all rise together.
        // `rise` goes 0 → 1, then we map that to `0 → (size*40)` px upward.
        rise.value = withRepeat(
            withDelay(
                index * 60,
                withTiming(1, { duration: travelDuration, easing: Easing.inOut(Easing.quad) })
            ),
            -1,
            false
        );
        twinkle.value = withRepeat(
            withTiming(1, { duration: twinkleDuration, easing: Easing.inOut(Easing.quad) }),
            -1,
            true // reverse — smooth twinkle
        );
        return () => {
            cancelAnimation(rise);
            cancelAnimation(twinkle);
        };
    }, [index, travelDuration, twinkleDuration]);

    const riseStyle = useAnimatedStyle(() => ({
        // Travel further so the rise is noticeable even at small sizes —
        // hero particles travel slightly more (~120–160px) than ambient
        // dust (~90–120px) to draw the eye around the logo.
        transform: [{ translateY: -rise.value * (size * 28 + 70) }],
    }));

    const twinkleStyle = useAnimatedStyle(() => {
        // Bottom of twinkle keeps at least 35% of max opacity so particles
        // never fully vanish — keeps the field always present, just
        // shimmering.
        const o = interpolate(twinkle.value, [0, 1], [maxOpacity * 0.35, maxOpacity]);
        return { opacity: o };
    });

    return (
        <Animated.View
            pointerEvents="none"
            style={[
                particleStyles.base,
                {
                    left,
                    top,
                    width: size,
                    height: size,
                    borderRadius: size / 2,
                    backgroundColor: '#FFFFFF',
                    // Hero particles get a soft white glow so they read as
                    // "specks of light" rather than flat dots.
                    ...(isHero
                        ? Platform.select({
                              ios: {
                                  shadowColor: '#FFFFFF',
                                  shadowOffset: { width: 0, height: 0 },
                                  shadowOpacity: 0.7,
                                  shadowRadius: 4,
                              },
                              android: {
                                  // No native blur on a flat view, but a
                                  // translucent halo view behind each hero
                                  // would cost more renders. Skip on
                                  // Android; the larger size + brighter
                                  // opacity still reads as luminous.
                              },
                          })
                        : {}),
                },
                twinkleStyle,
                riseStyle,
            ]}
        />
    );
}

// Separate stylesheet so the per-frame style array stays small.
const particleStyles = StyleSheet.create({
    base: {
        position: 'absolute',
    },
});

export default function AnimatedSplash({ onAnimationFinish }: { onAnimationFinish: () => void }) {
    // Read the user's saved language so the splash label matches the rest
    // of the app. Defaults to Melayu (matches LanguageContext default) and
    // falls back silently if AsyncStorage fails — startup should never block
    // on this read.
    const [loadingLabel, setLoadingLabel] = useState<string>('Memuatkan…');
    useEffect(() => {
        AsyncStorage.getItem('app-language')
            .then(stored => {
                if (stored === 'English') setLoadingLabel('Loading…');
            })
            .catch(() => {
                /* keep default */
            });
    }, []);

    // --- Logo intro ---
    const logoScale = useSharedValue(0.86);
    const logoOpacity = useSharedValue(0);

    // --- Title + tagline intro ---
    const titleOpacity = useSharedValue(0);
    const titleTranslateY = useSharedValue(8);
    const taglineOpacity = useSharedValue(0);
    const taglineTranslateY = useSharedValue(8);

    // --- Determinate progress (0 → 1 over SPLASH_DURATION_MS) ---
    // This drives the fill width. We animate `width` directly (not scaleX)
    // because RN's default `scaleX` origin is `center`, and we need the
    // fill to grow strictly from the left edge to the right.
    const progress = useSharedValue(0);

    // --- Shimmer highlight (independent, loops continuously) ---
    // Sliding a soft white highlight across the bar while the fill animates
    // gives the bar a modern "polished" feel even during the slow fill.
    const shimmer = useSharedValue(-0.4);

    useEffect(() => {
        // Logo: simple fade-in + small overshoot, NO breathing sequence.
        // A `withSequence` of three timings drops frames on iOS first paint
        // because the worklet gets compiled at runtime alongside image
        // decoding. A single `withSpring` is much cheaper and animates
        // identically on iOS and Android.
        // Use a tiny initial delay so the very first frame doesn't pay the
        // image-decode cost AND the animation start cost simultaneously
        // (iOS Simulator throttles when both happen at t=0).
        logoOpacity.value = withDelay(80, withTiming(1, { duration: 600 }));
        logoScale.value = withDelay(
            80,
            withSpring(1, {
                damping: 18,
                stiffness: 180,
                mass: 0.8,
                overshootClamping: true,
            })
        );

        // Title: slide-up + fade
        titleOpacity.value = withDelay(380, withTiming(1, { duration: 700 }));
        titleTranslateY.value = withDelay(
            380,
            withTiming(0, { duration: 700, easing: Easing.out(Easing.cubic) })
        );

        // Tagline: a touch later than title
        taglineOpacity.value = withDelay(620, withTiming(1, { duration: 700 }));
        taglineTranslateY.value = withDelay(
            620,
            withTiming(0, { duration: 700, easing: Easing.out(Easing.cubic) })
        );

        // Determinate bar fill — slow, smooth, easeInOut so it feels calm.
        // `onAnimationFinish` is invoked via runOnJS exactly once when it
        // reaches 1, which means the user actually sees the bar complete.
        progress.value = withTiming(
            1,
            { duration: SPLASH_DURATION_MS, easing: Easing.inOut(Easing.cubic) },
            (finished) => {
                if (finished) {
                    runOnJS(onAnimationFinish)();
                }
            }
        );

        // Shimmer loops continuously across the visible track while the
        // bar fills. It travels from just-before the left edge to just
        // past the right edge.
        shimmer.value = withRepeat(
            withTiming(1.2, { duration: 1400, easing: Easing.inOut(Easing.quad) }),
            -1,
            false
        );

        // Safety net — even if the worklet callback never fires for some
        // reason, we still hand control back to RootLayout eventually.
        const safety = setTimeout(() => {
            onAnimationFinish();
        }, SPLASH_DURATION_MS + 400);

        return () => {
            cancelAnimation(progress);
            cancelAnimation(shimmer);
            cancelAnimation(logoScale);
            clearTimeout(safety);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const animatedLogoStyle = useAnimatedStyle(() => ({
        transform: [{ scale: logoScale.value }],
        opacity: logoOpacity.value,
    }));

    const animatedTitleStyle = useAnimatedStyle(() => ({
        opacity: titleOpacity.value,
        transform: [{ translateY: titleTranslateY.value }],
    }));

    const animatedTaglineStyle = useAnimatedStyle(() => ({
        opacity: taglineOpacity.value,
        transform: [{ translateY: taglineTranslateY.value }],
    }));

    // Determinate fill — width from 0 → BAR_WIDTH. Animating width gives
    // us a guaranteed left-edge anchor without fighting RN's transform
    // origin defaults.
    const fillStyle = useAnimatedStyle(() => ({
        width: progress.value * BAR_WIDTH,
    }));

    // Shimmer position — a soft highlight that rides across the bar.
    const shimmerStyle = useAnimatedStyle(() => {
        const tx = interpolate(
            shimmer.value,
            [0, 1],
            [-BAR_WIDTH * 0.5, BAR_WIDTH * 1.0],
            Extrapolation.CLAMP
        );
        return { transform: [{ translateX: tx }] };
    });

    return (
        <Animated.View exiting={FadeOut.duration(500)} style={styles.container}>
            {/* Starfield — fine white particles drifting upward behind the
                logo. Each particle twinkles independently for a slow, calm
                ambience that complements the Catholic hymnbook vibe. */}
            <View pointerEvents="none" style={styles.starfieldLayer}>
                {PARTICLES.map((p, i) => (
                    <Particle
                        key={i}
                        size={p.size}
                        left={p.left}
                        top={p.top}
                        travelDuration={p.travelDuration}
                        twinkleDuration={p.twinkleDuration}
                        twinklePhase={p.twinklePhase}
                        maxOpacity={p.maxOpacity}
                        index={i}
                        isHero={p.isHero}
                    />
                ))}
            </View>

            {/*
                Wrap a plain RN <Image> in an <Animated.View> for the logo
                animation. Using `Animated.Image` forces Reanimated to
                intercept Image's native component which has to finish
                image decoding before the opacity transform registers —
                iOS first-paint drops ~5-10 frames in that race. A plain
                Image inside an animated wrapper has none of that overhead.
            */}
            <Animated.View style={[styles.logoWrap, animatedLogoStyle]}>
                <Image
                    source={require('../assets/images/icon.png')}
                    style={styles.logoInner}
                    resizeMode="contain"
                    fadeDuration={0}
                />
            </Animated.View>

            <Animated.Text style={[styles.title, animatedTitleStyle]}>
                Pozoo Do Kinoingan
            </Animated.Text>

            <Animated.Text style={[styles.tagline, animatedTaglineStyle]}>
                Buku Lagu Katolik
            </Animated.Text>

            {/* Determinate progress bar */}
            <View style={styles.barWrapper}>
                <View style={styles.trackClip}>
                    {/* Empty background track */}
                    <View style={styles.trackBase} />

                    {/* Determinate fill — gradient strip pinned to the left.
                        We render the full SVG at BAR_WIDTH and let the
                        animated width clip it from the left as progress grows. */}
                    <Animated.View style={[styles.fillBar, fillStyle]} pointerEvents="none">
                        <Svg width={BAR_WIDTH} height={BAR_HEIGHT}>
                            <Defs>
                                <LinearGradient id="fillGrad" x1="0" y1="0" x2="1" y2="0">
                                    <Stop offset="0" stopColor="#A8E6A3" stopOpacity="0.95" />
                                    <Stop offset="0.5" stopColor="#FFFFFF" stopOpacity="0.95" />
                                    <Stop offset="1" stopColor="#A8E6A3" stopOpacity="0.95" />
                                </LinearGradient>
                            </Defs>
                            <Rect
                                x="0"
                                y="0"
                                rx={BAR_RADIUS}
                                ry={BAR_RADIUS}
                                width={BAR_WIDTH}
                                height={BAR_HEIGHT}
                                fill="url(#fillGrad)"
                            />
                        </Svg>
                    </Animated.View>

                    {/* Shimmer highlight — soft moving gloss on top of fill+track */}
                    <Animated.View style={[styles.shimmerWrap, shimmerStyle]}>
                        <Svg width={BAR_WIDTH * 0.5} height={BAR_HEIGHT}>
                            <Defs>
                                <LinearGradient id="shimmer" x1="0" y1="0" x2="1" y2="0">
                                    <Stop offset="0" stopColor="#FFFFFF" stopOpacity="0" />
                                    <Stop offset="0.5" stopColor="#FFFFFF" stopOpacity="0.55" />
                                    <Stop offset="1" stopColor="#FFFFFF" stopOpacity="0" />
                                </LinearGradient>
                            </Defs>
                            <Rect
                                x="0"
                                y="0"
                                rx={BAR_RADIUS}
                                ry={BAR_RADIUS}
                                width={BAR_WIDTH * 0.5}
                                height={BAR_HEIGHT}
                                fill="url(#shimmer)"
                            />
                        </Svg>
                    </Animated.View>
                </View>
            </View>

            <Animated.Text style={[styles.loadingLabel, animatedTaglineStyle]}>
                {loadingLabel}
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
    // Full-screen overlay layer that hosts the particle starfield. We keep
    // it as a plain View (not Animated.View) because all motion happens
    // inside the individual particles.
    starfieldLayer: {
        ...StyleSheet.absoluteFillObject,
    },
    logo: {
        width: 132,
        height: 132,
        marginBottom: 20,
    },
    // Wrapper for the logo so animations apply to a View (cheap) while
    // the inner Image handles its own native decode. Same external size.
    logoWrap: {
        width: 132,
        height: 152, // 132 + 20 (logo's marginBottom keeps spacing)
        justifyContent: 'flex-start',
        alignItems: 'center',
    },
    logoInner: {
        width: 132,
        height: 132,
    },
    title: {
        fontSize: 24,
        color: '#FFFFFF',
        fontFamily: 'Inter-Bold',
        fontWeight: 'bold',
        letterSpacing: 1,
        textShadowColor: 'rgba(0, 0, 0, 0.25)',
        textShadowOffset: { width: 0, height: 1 },
        textShadowRadius: 3,
    },
    tagline: {
        fontSize: 13,
        color: 'rgba(255, 255, 255, 0.85)',
        fontFamily: 'Inter-Regular',
        letterSpacing: 1.5,
        marginTop: 6,
        marginBottom: 28,
    },
    barWrapper: {
        width: BAR_WIDTH,
        height: BAR_HEIGHT,
        ...Platform.select({
            ios: {
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 1 },
                shadowOpacity: 0.18,
                shadowRadius: 3,
            },
            android: {
                elevation: 2,
            },
            default: {},
        }),
    },
    trackClip: {
        width: BAR_WIDTH,
        height: BAR_HEIGHT,
        borderRadius: BAR_RADIUS,
        overflow: 'hidden',
        position: 'relative',
    },
    trackBase: {
        position: 'absolute',
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
        backgroundColor: 'rgba(255, 255, 255, 0.18)',
    },
    // Fill bar — animated width, pinned left. SVG inside is sized to the
    // full BAR_WIDTH so the rounded right edge always renders cleanly.
    fillBar: {
        position: 'absolute',
        left: 0,
        top: 0,
        height: BAR_HEIGHT,
        overflow: 'hidden',
        borderTopLeftRadius: BAR_RADIUS,
        borderBottomLeftRadius: BAR_RADIUS,
    },
    shimmerWrap: {
        position: 'absolute',
        left: 0,
        top: 0,
        height: BAR_HEIGHT,
    },
    loadingLabel: {
        marginTop: 16,
        fontSize: 12,
        color: 'rgba(255, 255, 255, 0.7)',
        fontFamily: 'Inter-Regular',
        letterSpacing: 1,
    },
});
