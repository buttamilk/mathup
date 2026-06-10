import React, { useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  SafeAreaView,
  StatusBar,
} from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  withSequence,
  withDelay,
  Easing,
  FadeInDown,
  FadeInUp,
} from "react-native-reanimated";
import { colors } from "../constants/theme";

const { width, height } = Dimensions.get("window");

// Floating math symbol component
function FloatingSymbol({
  symbol,
  x,
  y,
  size,
  delay,
  opacity,
}: {
  symbol: string;
  x: number;
  y: number;
  size: number;
  delay: number;
  opacity: number;
}) {
  const translateY = useSharedValue(0);
  const rotate = useSharedValue(0);

  useEffect(() => {
    translateY.value = withDelay(
      delay,
      withRepeat(
        withSequence(
          withTiming(-14, { duration: 2800, easing: Easing.inOut(Easing.sin) }),
          withTiming(0, { duration: 2800, easing: Easing.inOut(Easing.sin) })
        ),
        -1,
        false
      )
    );
    rotate.value = withDelay(
      delay,
      withRepeat(
        withSequence(
          withTiming(-8, { duration: 3200, easing: Easing.inOut(Easing.sin) }),
          withTiming(8, { duration: 3200, easing: Easing.inOut(Easing.sin) })
        ),
        -1,
        true
      )
    );
  }, []);

  const animStyle = useAnimatedStyle(() => ({
    transform: [
      { translateY: translateY.value },
      { rotate: `${rotate.value}deg` },
    ],
  }));

  return (
    <Animated.Text
      style={[
        animStyle,
        {
          position: "absolute",
          left: x,
          top: y,
          fontSize: size,
          color: colors.white,
          opacity,
          fontWeight: "700",
        },
      ]}
    >
      {symbol}
    </Animated.Text>
  );
}

// The mascot — a big emoji character that bobs gently
function MascotCharacter() {
  const translateY = useSharedValue(0);
  const scale = useSharedValue(1);

  useEffect(() => {
    translateY.value = withRepeat(
      withSequence(
        withTiming(-12, { duration: 1800, easing: Easing.inOut(Easing.sin) }),
        withTiming(0, { duration: 1800, easing: Easing.inOut(Easing.sin) })
      ),
      -1,
      false
    );
    scale.value = withRepeat(
      withSequence(
        withTiming(1.04, { duration: 1800, easing: Easing.inOut(Easing.sin) }),
        withTiming(1, { duration: 1800, easing: Easing.inOut(Easing.sin) })
      ),
      -1,
      false
    );
  }, []);

  const animStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }, { scale: scale.value }],
  }));

  return (
    <Animated.View style={[styles.mascotContainer, animStyle]}>
      <Text style={styles.mascotEmoji}>🦉</Text>
      {/* Subtle shadow under the mascot that pulses with the float */}
      <Animated.View
        style={[
          styles.mascotShadow,
          useAnimatedStyle(() => ({
            opacity: 0.18 + (translateY.value / -12) * 0.1,
            transform: [{ scaleX: 1 - (translateY.value / -12) * 0.15 }],
          })),
        ]}
      />
    </Animated.View>
  );
}

interface Props {
  onNewUser: () => void;
  onReturningUser: () => void;
}

export default function SplashScreen({ onNewUser, onReturningUser }: Props) {
  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />

      {/* Background gradient layers */}
      <View style={styles.bgCircleTop} />
      <View style={styles.bgCircleBottom} />

      {/* Floating math symbols */}
      <FloatingSymbol symbol="π" x={28} y={height * 0.14} size={28} delay={0} opacity={0.18} />
      <FloatingSymbol symbol="∑" x={width - 52} y={height * 0.18} size={24} delay={400} opacity={0.15} />
      <FloatingSymbol symbol="√" x={width * 0.12} y={height * 0.52} size={20} delay={800} opacity={0.12} />
      <FloatingSymbol symbol="∞" x={width - 44} y={height * 0.48} size={22} delay={200} opacity={0.14} />
      <FloatingSymbol symbol="∫" x={width * 0.08} y={height * 0.32} size={18} delay={600} opacity={0.1} />
      <FloatingSymbol symbol="Δ" x={width * 0.82} y={height * 0.62} size={16} delay={1000} opacity={0.12} />
      <FloatingSymbol symbol="%" x={width * 0.72} y={height * 0.1} size={18} delay={300} opacity={0.13} />

      <SafeAreaView style={styles.safeArea}>
        {/* Top section — logo + tagline */}
        <Animated.View
          entering={FadeInDown.duration(700).delay(100).springify()}
          style={styles.topSection}
        >
          <Text style={styles.appName}>MathUp</Text>
          <Text style={styles.tagline}>Math doesn't have to hurt.</Text>
          <Text style={styles.subtext}>
            Get your final exam sorted.{"\n"}For real this time. 🎯
          </Text>
        </Animated.View>

        {/* Mascot */}
        <Animated.View
          entering={FadeInDown.duration(800).delay(300).springify()}
          style={styles.mascotWrapper}
        >
          <MascotCharacter />
        </Animated.View>

        {/* Bottom panel — buttons */}
        <Animated.View
          entering={FadeInUp.duration(700).delay(500).springify()}
          style={styles.bottomPanel}
        >
          <Text style={styles.bottomLabel}>Where do you want to start?</Text>

          <TouchableOpacity
            style={styles.buttonPrimary}
            onPress={onNewUser}
            activeOpacity={0.85}
          >
            <Text style={styles.buttonPrimaryText}>I'm new here 🚀</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.buttonSecondary}
            onPress={onReturningUser}
            activeOpacity={0.85}
          >
            <Text style={styles.buttonSecondaryText}>Welcome back 👋</Text>
          </TouchableOpacity>
        </Animated.View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.navy,
  },
  safeArea: {
    flex: 1,
    justifyContent: "space-between",
  },

  // Background decorative circles
  bgCircleTop: {
    position: "absolute",
    width: width * 0.9,
    height: width * 0.9,
    borderRadius: width * 0.45,
    backgroundColor: colors.accent,
    opacity: 0.08,
    top: -width * 0.3,
    left: -width * 0.2,
  },
  bgCircleBottom: {
    position: "absolute",
    width: width * 0.7,
    height: width * 0.7,
    borderRadius: width * 0.35,
    backgroundColor: colors.coral,
    opacity: 0.07,
    bottom: -width * 0.2,
    right: -width * 0.15,
  },

  // Top section
  topSection: {
    alignItems: "center",
    paddingTop: 24,
    paddingHorizontal: 32,
  },
  appName: {
    fontSize: 64,
    fontWeight: "800",
    color: colors.white,
    letterSpacing: -2,
    lineHeight: 68,
  },
  tagline: {
    fontSize: 22,
    color: colors.gold,
    fontWeight: "700",
    marginTop: 6,
    fontStyle: "italic",
    letterSpacing: 0.2,
  },
  subtext: {
    fontSize: 15,
    color: colors.textMuted,
    textAlign: "center",
    marginTop: 12,
    lineHeight: 22,
    letterSpacing: 0.1,
  },

  // Mascot
  mascotWrapper: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  mascotContainer: {
    alignItems: "center",
  },
  mascotEmoji: {
    fontSize: 110,
    lineHeight: 120,
  },
  mascotShadow: {
    width: 80,
    height: 16,
    borderRadius: 40,
    backgroundColor: colors.accent,
    marginTop: 8,
  },

  // Bottom panel
  bottomPanel: {
    backgroundColor: "rgba(255,255,255,0.06)",
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    paddingHorizontal: 24,
    paddingTop: 28,
    paddingBottom: 8,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
    borderBottomWidth: 0,
  },
  bottomLabel: {
    fontSize: 13,
    color: colors.textMuted,
    textAlign: "center",
    marginBottom: 16,
    letterSpacing: 0.3,
    textTransform: "uppercase",
  },
  buttonPrimary: {
    backgroundColor: colors.accent,
    borderRadius: 20,
    paddingVertical: 17,
    alignItems: "center",
    marginBottom: 12,
    shadowColor: colors.accent,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.45,
    shadowRadius: 16,
    elevation: 8,
  },
  buttonPrimaryText: {
    color: colors.white,
    fontSize: 17,
    fontWeight: "700",
    letterSpacing: 0.2,
  },
  buttonSecondary: {
    backgroundColor: "transparent",
    borderRadius: 20,
    paddingVertical: 16,
    alignItems: "center",
    borderWidth: 1.5,
    borderColor: "rgba(255,255,255,0.2)",
    marginBottom: 16,
  },
  buttonSecondaryText: {
    color: colors.white,
    fontSize: 17,
    fontWeight: "600",
    letterSpacing: 0.2,
  },
});
