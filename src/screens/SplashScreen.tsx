import React, { useEffect, useRef } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  SafeAreaView,
  StatusBar,
  Animated,
  Easing,
  Image,
} from "react-native";

const { width } = Dimensions.get("window");

const illustration = require("../../assets/illustration-starter.png");

// Simple fade+slide entrance animation
function FadeSlideIn({
  children,
  delay = 0,
  style,
}: {
  children: React.ReactNode;
  delay?: number;
  style?: object;
}) {
  const opacity = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(20)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(opacity, {
        toValue: 1,
        duration: 550,
        delay,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.timing(translateY, {
        toValue: 0,
        duration: 550,
        delay,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  return (
    <Animated.View style={[style, { opacity, transform: [{ translateY }] }]}>
      {children}
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
      <StatusBar barStyle="dark-content" />

      <SafeAreaView style={styles.safeArea}>

        {/* App name + tagline */}
        <FadeSlideIn delay={80} style={styles.topSection}>
          <Text style={styles.appName}>MathUp</Text>
          <Text style={styles.tagline}>Math doesn't have to hurt.</Text>
          <Text style={styles.subtext}>
            Get your final exam sorted.{"\n"}For real this time. 🎯
          </Text>
        </FadeSlideIn>

        {/* Gray zone: illustration + buttons seamlessly connected */}
        <View style={styles.grayZone}>
          <FadeSlideIn delay={200} style={styles.illustrationWrapper}>
            <Image
              source={illustration}
              style={styles.illustration}
              resizeMode="cover"
            />
          </FadeSlideIn>

          <FadeSlideIn delay={380} style={styles.bottomPanel}>
          <TouchableOpacity
            style={styles.buttonSecondary}
            onPress={onReturningUser}
            activeOpacity={0.8}
          >
            <Text style={styles.buttonSecondaryText}>Welcome back 👋</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.buttonPrimary}
            onPress={onNewUser}
            activeOpacity={0.8}
          >
            <Text style={styles.buttonPrimaryText}>I'm new here 🚀</Text>
          </TouchableOpacity>
        </FadeSlideIn>
        </View>

      </SafeAreaView>

      {/* Gray fill so no white gap at very bottom on tall phones */}
      <View style={styles.bottomFill} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  safeArea: {
    flex: 1,
    justifyContent: "flex-end",
  },

  // Top
  topSection: {
    alignItems: "center",
    paddingTop: 20,
    paddingHorizontal: 32,
    paddingBottom: 80,
  },
  appName: {
    fontFamily: "Karla_700Bold",
    fontSize: 64,
    color: "#222222",
    letterSpacing: -3,
    lineHeight: 68,
  },
  tagline: {
    fontFamily: "Caveat_700Bold",
    fontSize: 22,
    color: "#2265FF",
    marginTop: 4,
    letterSpacing: 0.2,
  },
  subtext: {
    fontFamily: "DMSans_400Regular",
    fontSize: 14,
    color: "#888888",
    textAlign: "center",
    marginTop: 10,
    lineHeight: 21,
  },

  grayZone: {
    backgroundColor: "#F7F7F7",
  },

  // Illustration
  illustrationWrapper: {
    overflow: "hidden",
  },
  illustration: {
    width: width * 1.15,
    height: 220,
    marginLeft: -width * 0.07,
  },

  // Bottom panel — gray matches the illustration ground
  bottomPanel: {
    backgroundColor: "#F7F7F7",
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 16,
    gap: 12,
  },
  bottomFill: {
    backgroundColor: "#F7F7F7",
    height: 40,
  },
  buttonPrimary: {
    backgroundColor: "#2265FF",
    borderRadius: 16,
    paddingVertical: 16,
    alignItems: "center",
    shadowColor: "#2265FF",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 6,
  },
  buttonPrimaryText: {
    fontFamily: "Karla_700Bold",
    color: "#FFFFFF",
    fontSize: 16,
    letterSpacing: 0.1,
  },
  buttonSecondary: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    paddingVertical: 15,
    alignItems: "center",
    borderWidth: 1.5,
    borderColor: "#2265FF",
  },
  buttonSecondaryText: {
    fontFamily: "Karla_700Bold",
    color: "#333333",
    fontSize: 16,
    letterSpacing: 0.1,
  },
});
