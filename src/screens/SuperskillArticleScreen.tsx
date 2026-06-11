import React, { useRef, useEffect, useState } from "react";
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
import { C, T, cardShadow } from "../theme";
import type { Superskill } from "./SuperskillsScreen";

const haptic = () => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

const TOTAL_SLIDES = 4;

// ─── Inline text segments (supports multiple bold phrases) ────────────────────
type Seg = { text: string; bold?: boolean };

function RichText({ segments }: { segments: Seg[] }) {
  return (
    <Text style={s.body}>
      {segments.map((seg, i) =>
        seg.bold
          ? <Text key={i} style={s.bodyBold}>{seg.text}</Text>
          : <Text key={i}>{seg.text}</Text>
      )}
    </Text>
  );
}

// ─── Slide data ───────────────────────────────────────────────────────────────
interface Slide {
  title: string;
  illustration: any;
  segments: Seg[];
}

const SLIDES_BY_ID: Record<string, Slide[]> = {
  stress: [
    {
      title: "Stress triggers:\nWhat is that?",
      illustration: require("../../assets/Home/Card/skill-stress.png"),
      segments: [
        { text: "Stress triggers are things that happen around us that can " },
        { text: "affect how we feel.", bold: true },
        { text: " Something that feels exciting and motivating to one person " },
        { text: "might feel stressful or overwhelming to someone else.", bold: true },
        { text: " It's how we experience and handle these situations that makes the difference." },
      ],
    },
    {
      title: "Your body\non stress",
      illustration: require("../../assets/illustration-starter.png"),
      segments: [
        { text: "When you feel stressed, your body releases " },
        { text: "adrenaline and cortisol.", bold: true },
        { text: " Your heart beats faster, muscles tense up and breathing quickens — your body's way of " },
        { text: "preparing you to face a challenge.", bold: true },
      ],
    },
    {
      title: "Short-term vs.\nlong-term stress",
      illustration: require("../../assets/Home/Card/skill-stress.png"),
      segments: [
        { text: "A little stress can be " },
        { text: "helpful in the short term", bold: true },
        { text: " — it sharpens focus and motivates you. But " },
        { text: "chronic stress over weeks or months", bold: true },
        { text: " can lead to exhaustion, poor sleep, and difficulty concentrating." },
      ],
    },
    {
      title: "What you\ncan do",
      illustration: require("../../assets/illustration-starter.png"),
      segments: [
        { text: "The good news: " },
        { text: "stress is manageable.", bold: true },
        { text: " Regular breaks, physical activity, talking to someone you trust, and " },
        { text: "simple breathing exercises", bold: true },
        { text: " can all help you stay in balance. Awareness is already the first step." },
      ],
    },
  ],
  learning: [
    {
      title: "Why learning\nmethods matter",
      illustration: require("../../assets/Home/Card/pizza.png"),
      segments: [
        { text: "Not all study time is equal. Using the " },
        { text: "right techniques", bold: true },
        { text: " can cut your study time in half while " },
        { text: "doubling what you remember.", bold: true },
      ],
    },
    {
      title: "Spaced\nrepetition",
      illustration: require("../../assets/illustration-starter.png"),
      segments: [
        { text: "Instead of cramming, review material at " },
        { text: "increasing intervals.", bold: true },
        { text: " Your brain strengthens memories each time you retrieve them — especially when you " },
        { text: "wait until you almost forget.", bold: true },
      ],
    },
    {
      title: "The Pomodoro\nmethod",
      illustration: require("../../assets/Home/Card/pizza.png"),
      segments: [
        { text: "Work for " },
        { text: "25 minutes", bold: true },
        { text: ", then take a 5-minute break. After four rounds, take a longer break. This keeps your " },
        { text: "focus sharp and prevents burnout.", bold: true },
      ],
    },
    {
      title: "Active recall\n& mind maps",
      illustration: require("../../assets/illustration-starter.png"),
      segments: [
        { text: "Testing yourself is " },
        { text: "far more effective than re-reading.", bold: true },
        { text: " Mind maps help you see connections between ideas and make information " },
        { text: "easier to store and retrieve.", bold: true },
      ],
    },
  ],
  sleep: [
    {
      title: "Why sleep\nmatters for grades",
      illustration: require("../../assets/cards/sleeping child.png"),
      segments: [
        { text: "During sleep your brain " },
        { text: "consolidates what you learned during the day.", bold: true },
        { text: " Skipping sleep before an exam doesn't just make you tired — it " },
        { text: "actively erases memories", bold: true },
        { text: " you formed while studying." },
      ],
    },
    {
      title: "What happens\novernight",
      illustration: require("../../assets/illustration-starter.png"),
      segments: [
        { text: "Deep sleep triggers the " },
        { text: "hippocampus to transfer short-term memories", bold: true },
        { text: " into long-term storage. REM sleep then " },
        { text: "links new knowledge to existing ideas,", bold: true },
        { text: " forming the connections that make understanding stick." },
      ],
    },
    {
      title: "How much\ndo you need?",
      illustration: require("../../assets/cards/sleeping child.png"),
      segments: [
        { text: "Teenagers need " },
        { text: "8–10 hours per night.", bold: true },
        { text: " Even one night of " },
        { text: "six hours or less", bold: true },
        { text: " measurably reduces attention, working memory, and problem-solving ability the next day." },
      ],
    },
    {
      title: "Sleep better\ntonight",
      illustration: require("../../assets/illustration-starter.png"),
      segments: [
        { text: "Set a consistent bedtime, " },
        { text: "avoid screens 30 minutes before sleep,", bold: true },
        { text: " and keep your room cool and dark. Even small improvements in sleep can " },
        { text: "noticeably boost your performance", bold: true },
        { text: " within a week." },
      ],
    },
  ],
};

// ─── Floating cat badge (same as intro screen) ────────────────────────────────
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
      <Image source={require("../../assets/cards/cat meditating.png")} style={s.avatarImg} resizeMode="contain" />
    </Animated.View>
  );
}

// ─── Screen ───────────────────────────────────────────────────────────────────
interface Props {
  skill: Superskill;
  onClose: () => void;
  bottomTabBar: React.ReactNode;
}

export default function SuperskillArticleScreen({ skill, onClose, bottomTabBar }: Props) {
  const [step, setStep] = useState(0);
  const slides = SLIDES_BY_ID[skill.id] ?? SLIDES_BY_ID.stress;
  const slide = slides[step];
  const isFirst = step === 0;
  const isLast  = step === slides.length - 1;
  const progress = `${Math.round(((step + 1) / TOTAL_SLIDES) * 100)}%`;

  const category = {
    stress:   "Self-organization",
    learning: "Learning methods",
    sleep:    "Health & Performance",
  }[skill.id] ?? "Self-organization";

  const goNext = () => { haptic(); isLast ? onClose() : setStep(s => s + 1); };
  const goBack = () => { haptic(); setStep(s => s - 1); };

  return (
    <View style={{ flex: 1, backgroundColor: C.pageBg }}>
      <StatusBar barStyle="dark-content" />
      <SafeAreaView style={{ flex: 1 }} edges={["top"] as any}>

        {/* ── Header ── */}
        <View style={s.header}>
          <TouchableOpacity style={s.closeBtn} onPress={() => { haptic(); onClose(); }}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
            <Ionicons name="close" size={20} color={C.text} />
          </TouchableOpacity>
          <Text style={s.category}>{category}</Text>
          <CatBadge />
        </View>

        {/* ── Progress bar ── */}
        <View style={s.progressTrack}>
          <View style={[s.progressFill, { width: progress as any }]} />
        </View>

        {/* ── Title ── */}
        <View style={s.titleBlock}>
          <Text style={s.title}>{slide.title}</Text>
        </View>

        {/* ── Illustration — full width ── */}
        <View style={s.illustrationWrap}>
          <Image source={slide.illustration} style={s.illustration} resizeMode="cover" />
        </View>

        {/* ── Body text ── */}
        <View style={s.bodyBlock}>
          <RichText segments={slide.segments} />
        </View>

        {/* ── Buttons ── */}
        <View style={s.btnRow}>
          {!isFirst ? (
            <TouchableOpacity style={[s.btnBack, cardShadow]} activeOpacity={0.85} onPressIn={haptic} onPress={goBack}>
              <Text style={s.btnBackText}>Back</Text>
            </TouchableOpacity>
          ) : (
            <View style={s.btnPlaceholder} />
          )}
          <TouchableOpacity style={[s.btnNext, cardShadow]} activeOpacity={0.85} onPressIn={haptic} onPress={goNext}>
            <Text style={s.btnNextText}>{isLast ? "Finish" : "Next"}</Text>
          </TouchableOpacity>
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
  avatarImg: { width: 30, height: 30 },

  // Progress bar
  progressTrack: {
    marginHorizontal: 16,
    height: 6,
    backgroundColor: C.offWhite,
    borderRadius: 3,
    overflow: "hidden",
  },
  progressFill: {
    height: 6,
    backgroundColor: C.primary,
    borderRadius: 3,
  },

  // Title
  titleBlock: {
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 20,
    alignItems: "center",
  },
  title: {
    fontFamily: "Karla_700Bold",
    fontSize: 28,
    lineHeight: 34,
    color: C.text,
    textAlign: "center",
    letterSpacing: -0.5,
  },

  // Illustration — full width
  illustrationWrap: {
    width: "100%",
    height: 200,
  },
  illustration: {
    width: "100%",
    height: "100%",
  },

  // Body text
  bodyBlock: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 20,
    justifyContent: "center",
  },
  body: {
    fontFamily: "Karla_400Regular",
    fontSize: 16,
    lineHeight: 26,
    color: C.text,
    textAlign: "center",
  },
  bodyBold: {
    fontFamily: "Karla_700Bold",
  },

  // Buttons — same width, drawn shadow
  btnRow: {
    flexDirection: "row",
    paddingHorizontal: 24,
    paddingBottom: 16,
    paddingTop: 12,
    gap: 12,
  },
  btnBack: {
    flex: 1,
    height: 52,
    borderRadius: 16,
    backgroundColor: C.white,
    borderWidth: 1,
    borderColor: C.border,
    alignItems: "center",
    justifyContent: "center",
  },
  btnBackText: {
    fontFamily: "Karla_700Bold",
    fontSize: 16,
    color: C.text,
  },
  btnPlaceholder: { flex: 1 },
  btnNext: {
    flex: 1,
    height: 52,
    borderRadius: 16,
    backgroundColor: C.primary,
    alignItems: "center",
    justifyContent: "center",
  },
  btnNextText: {
    fontFamily: "Karla_700Bold",
    fontSize: 16,
    color: C.white,
  },
});
