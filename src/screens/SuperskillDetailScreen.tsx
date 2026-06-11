import React, { useRef, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  Image,
  Animated,
  Easing,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { C, T, tagShadow } from "../theme";
import type { Superskill } from "./SuperskillsScreen";

const haptic = () => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

// ─── Per-skill intro content ──────────────────────────────────────────────────
interface IntroContent {
  category: string;
  title: string;
  duration: string;
  body: string;
  bold: string; // phrase within body to bold
  illustration: any;
}

const INTRO: Record<string, IntroContent> = {
  stress: {
    category: "Self-organization",
    title: "Little intro to stress management",
    duration: "5min",
    body: "Learn to manage psychological or physical stress in a healthy and conscious way: What stress is, where it comes from, and what you can do about it in the short and long term.",
    bold: "psychological or physical stress",
    illustration: require("../../assets/illustration-starter.png"),
  },
  learning: {
    category: "Learning methods",
    title: "4 easy-peasy learning methods to try",
    duration: "5min",
    body: "Discover four proven learning techniques that make studying easier, faster and more effective. From spaced repetition to the Pomodoro method — pick what works best for you.",
    bold: "spaced repetition to the Pomodoro method",
    illustration: require("../../assets/Home/Card/pizza.png"),
  },
  sleep: {
    category: "Health & Performance",
    title: "Why Sleeping More Might Improve Your Grades",
    duration: "5min",
    body: "Sleep is one of the most underrated study tools. Learn how deep sleep consolidates memory, what happens in your brain overnight, and simple habits to improve your sleep quality.",
    bold: "deep sleep consolidates memory",
    illustration: require("../../assets/cards/sleeping child.png"),
  },
};

// ─── Body text with one bold phrase ──────────────────────────────────────────
function BodyWithBold({ text, bold }: { text: string; bold: string }) {
  const idx = text.indexOf(bold);
  if (idx === -1) return <Text style={s.body}>{text}</Text>;
  return (
    <Text style={s.body}>
      {text.slice(0, idx)}
      <Text style={s.bodyBold}>{bold}</Text>
      {text.slice(idx + bold.length)}
    </Text>
  );
}

// ─── Floating cat badge ───────────────────────────────────────────────────────
function CatBadge() {
  const float = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(float, { toValue: -5, duration: 1400, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
        Animated.timing(float, { toValue:  0, duration: 1400, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
      ])
    ).start();
  }, []);

  return (
    <Animated.View style={[s.avatarBadge, { transform: [{ translateY: float }] }]}>
      <Image
        source={require("../../assets/cards/cat meditating.png")}
        style={s.avatarImg}
        resizeMode="contain"
      />
    </Animated.View>
  );
}

// ─── Screen ───────────────────────────────────────────────────────────────────
interface Props {
  skill: Superskill;
  onClose: () => void;
  onLetsGo: () => void;
  bottomTabBar: React.ReactNode;
}

export default function SuperskillDetailScreen({ skill, onClose, onLetsGo, bottomTabBar }: Props) {
  const content = INTRO[skill.id] ?? INTRO.stress;

  return (
    <View style={{ flex: 1, backgroundColor: C.pageBg }}>
      <StatusBar barStyle="dark-content" />
      <SafeAreaView style={{ flex: 1 }} edges={["top"] as any}>

        {/* ── Header ── */}
        <View style={s.header}>
          <TouchableOpacity
            style={s.closeBtn}
            onPress={() => { haptic(); onClose(); }}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            <Ionicons name="close" size={20} color={C.text} />
          </TouchableOpacity>

          <Text style={s.category}>{content.category}</Text>

          <CatBadge />
        </View>

        {/* ── Progress bar ── */}
        <View style={s.progressTrack}>
          <View style={s.progressFill} />
        </View>

        {/* ── Scrollable content ── */}
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={s.scroll}
        >
          {/* "Superskills" script label */}
          <Text style={s.superskillsLabel}>Superskills</Text>

          {/* Title */}
          <Text style={s.title}>{content.title}</Text>
        </ScrollView>

        {/* Illustration — full width, outside padded scroll area */}
        <View style={s.illustrationWrap}>
          <Image
            source={content.illustration}
            style={s.illustration}
            resizeMode="contain"
          />
        </View>

        {/* Body + CTA — off-white panel, seamless with illustration base */}
        <View style={s.bottomPanel}>
          <BodyWithBold text={content.body} bold={content.bold} />

          {/* Duration + CTA centered as a pair */}
          <View style={s.ctaRow}>
            <View style={s.durationRow}>
              <Ionicons name="time-outline" size={16} color={C.muted} />
              <Text style={[T.body14, { color: C.muted, marginLeft: 4 }]}>{content.duration}</Text>
            </View>
            <TouchableOpacity
              style={[s.letsGoBtn, tagShadow]}
              activeOpacity={0.85}
              onPressIn={haptic}
              onPress={() => { haptic(); onLetsGo(); }}
            >
              <Text style={s.letsGoBtnText}>Let's go</Text>
            </TouchableOpacity>
          </View>
        </View>

      </SafeAreaView>
      {bottomTabBar}
    </View>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────
const s = StyleSheet.create({
  // Header
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 12,
  },
  closeBtn: {
    width: 36, height: 36,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: C.border,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: C.white,
  },
  category: {
    flex: 1,
    fontFamily: "Karla_700Bold",
    fontSize: 16,
    color: C.text,
    textAlign: "center",
  },
  avatarBadge: {
    width: 36, height: 36,
    borderRadius: 18,
    backgroundColor: "#F4F3EB",
    overflow: "hidden",
    alignItems: "center",
    justifyContent: "center",
  },
  avatarImg: {
    width: 30, height: 30,
  },

  // Progress bar
  progressTrack: {
    marginHorizontal: 16,
    height: 6,
    backgroundColor: C.offWhite,
    borderRadius: 3,
    overflow: "hidden",
    marginBottom: 4,
  },
  progressFill: {
    width: "12%",
    height: 6,
    backgroundColor: C.primary,
    borderRadius: 3,
  },

  // Scroll content — no bottom padding, illustration sits below
  scroll: {
    paddingHorizontal: 24,
    paddingTop: 28,
    paddingBottom: 0,
    alignItems: "center",
  },

  // "Superskills" script label
  superskillsLabel: {
    fontFamily: "Caveat_700Bold",
    fontSize: 22,
    color: C.primary,
    marginBottom: 12,
    textAlign: "center",
  },

  // Title
  title: {
    fontFamily: "Karla_700Bold",
    fontSize: 28,
    lineHeight: 34,
    color: C.text,
    textAlign: "center",
    letterSpacing: -0.5,
    marginBottom: 28,
  },

  // Illustration — full bleed edge to edge
  illustrationWrap: {
    width: "100%",
    height: 200,
  },
  illustration: {
    width: "100%",
    height: "100%",
  },

  // Off-white panel — body text + CTA, seamless below illustration
  bottomPanel: {
    backgroundColor: "#F7F7F7",
    paddingHorizontal: 24,
    paddingTop: 20,   // illustration → text: tighter
    paddingBottom: 28,
  },

  // Body text
  body: {
    fontFamily: "Karla_400Regular",
    fontSize: 16,
    lineHeight: 24,
    color: C.text,
    textAlign: "center",
  },
  bodyBold: {
    fontFamily: "Karla_700Bold",
  },

  // Duration + CTA centered together as a pair
  ctaRow: {
    marginTop: 36,  // text → button: more breathing room
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 16,
  },
  durationRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  letsGoBtn: {
    paddingHorizontal: 28,
    paddingVertical: 14,
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: C.primary,
    backgroundColor: C.white,
  },
  letsGoBtnText: {
    fontFamily: "Karla_700Bold",
    fontSize: 16,
    color: C.primary,
  },
});
