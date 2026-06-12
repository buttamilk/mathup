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
import Svg, { Circle, Ellipse, Path, G } from "react-native-svg";
import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { C, cardShadow } from "../theme";
import type { Superskill } from "./SuperskillsScreen";

// ─── Animated SVG components ──────────────────────────────────────────────────
const AnimatedEllipse = Animated.createAnimatedComponent(Ellipse);
const AnimatedG       = Animated.createAnimatedComponent(G);

const haptic = () => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

// ─── Rich text ────────────────────────────────────────────────────────────────
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

// ─── Slide data types ─────────────────────────────────────────────────────────
interface TextSlide  { type: "text";       title: string; illustration: any; segments: Seg[] }
interface VideoSlide { type: "video";      title: string; illustration: any; segments: Seg[] }
interface DoneSlide  { type: "completion"; headline: string; achievement: string; ctaLabel: string }
type Slide = TextSlide | VideoSlide | DoneSlide;

// ─── Slide content ────────────────────────────────────────────────────────────
const SLIDES: Record<string, Slide[]> = {
  stress: [
    {
      type: "text",
      title: "Stress triggers:\nWhat is that?",
      illustration: require("../../assets/Home/Card/pizza.png"),
      segments: [
        { text: "Stress triggers are things that happen around us that can " },
        { text: "affect how we feel.", bold: true },
        { text: " Something that feels exciting and motivating to one person " },
        { text: "might feel stressful or overwhelming to someone else.", bold: true },
        { text: " It's how we experience and handle these situations that makes the difference." },
      ],
    },
    {
      type: "video",
      title: "How to handle stress",
      illustration: require("../../assets/illustration-starter.png"),
      segments: [
        { text: "Stress is a normal part of life, but too much of it can take a " },
        { text: "toll on your health and wellbeing.", bold: true },
        { text: " Learn to notice when you're reaching your limit and give yourself time to recover. Taking care of yourself is just as important as getting things done." },
      ],
    },
    {
      type: "completion",
      headline: "Well done!",
      achievement: "New superskill earned:\nFocus mode · 50 mastery points",
      ctaLabel: "How well do you manage stress?",
    },
  ],
  learning: [
    {
      type: "text",
      title: "Why learning\nmethods matter",
      illustration: require("../../assets/Home/Card/pizza.png"),
      segments: [
        { text: "Not all study time is equal. Using the " },
        { text: "right techniques", bold: true },
        { text: " can cut your study time in half while " },
        { text: "doubling what you actually remember.", bold: true },
      ],
    },
    {
      type: "video",
      title: "The Pomodoro\nmethod in action",
      illustration: require("../../assets/illustration-starter.png"),
      segments: [
        { text: "Work for " },
        { text: "25 focused minutes,", bold: true },
        { text: " then take a 5-minute break. This simple rhythm keeps your " },
        { text: "focus sharp and prevents burnout.", bold: true },
        { text: " Watch the video to see it in practice." },
      ],
    },
    {
      type: "completion",
      headline: "Well done!",
      achievement: "New superskill earned:\nLearning Pro · 50 mastery points",
      ctaLabel: "Test your learning style",
    },
  ],
  sleep: [
    {
      type: "text",
      title: "Why sleep\nboosts grades",
      illustration: require("../../assets/cards/sleeping child.png"),
      segments: [
        { text: "During sleep your brain " },
        { text: "consolidates what you learned during the day.", bold: true },
        { text: " Skipping sleep before an exam " },
        { text: "actively erases memories", bold: true },
        { text: " you formed while studying." },
      ],
    },
    {
      type: "video",
      title: "Your brain\novernight",
      illustration: require("../../assets/illustration-starter.png"),
      segments: [
        { text: "Deep sleep triggers the " },
        { text: "transfer of short-term memories", bold: true },
        { text: " into long-term storage. REM sleep then links new knowledge to existing ideas — the connections that make things " },
        { text: "truly stick.", bold: true },
      ],
    },
    {
      type: "completion",
      headline: "Well done!",
      achievement: "New superskill earned:\nSleep master · 50 mastery points",
      ctaLabel: "How is your sleep hygiene?",
    },
  ],
};

const CATEGORY: Record<string, string> = {
  stress:   "Self-organization",
  learning: "Learning methods",
  sleep:    "Health & Performance",
};

// ─── Floating cat badge ───────────────────────────────────────────────────────
function CatBadge() {
  const floatY = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(floatY, { toValue: -5, duration: 1400, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
        Animated.timing(floatY, { toValue:  0, duration: 1400, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
      ])
    ).start();
  }, []);
  return (
    <Animated.View style={[s.catBadge, { transform: [{ translateY: floatY }] }]}>
      <Image source={require("../../assets/cards/cat meditating.png")} style={s.catImg} resizeMode="contain" />
    </Animated.View>
  );
}

// ─── Star sparkle (SVG) ───────────────────────────────────────────────────────
function StarSVG({ size, color }: { size: number; color: string }) {
  const h = size / 2;
  const d =
    `M${h} 0 L${(h * 1.12).toFixed(1)} ${(h * 0.78).toFixed(1)} ` +
    `L${size} ${h} L${(h * 1.12).toFixed(1)} ${(h * 1.22).toFixed(1)} ` +
    `L${h} ${size} L${(h * 0.88).toFixed(1)} ${(h * 1.22).toFixed(1)} ` +
    `L0 ${h} L${(h * 0.88).toFixed(1)} ${(h * 0.78).toFixed(1)} Z`;
  return (
    <Svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      <Path d={d} fill={color} />
    </Svg>
  );
}

// ─── Sparkle positions (absolute, relative to blob container) ─────────────────
const SPARKLES = [
  { x: 126, y:  10, color: "#FACC15", sz: 14 },
  { x: 152, y:  72, color: "#A855F7", sz: 10 },
  { x:  -2, y:  28, color: "#60A5FA", sz: 12 },
  { x: -10, y:  92, color: "#FACC15", sz:  8 },
  { x:  92, y:  -6, color: "#A855F7", sz: 10 },
];

// ─── Animated blob mascot ─────────────────────────────────────────────────────
const BSIZE   = 160;
const BCX     = 80;
const BCY     = 80;
const BR      = 67;
const EYE_RX  = 8.8;
const EYE_RY  = 10.4;
const EYE_Y   = BCY - 9.6;
const EYE_OX  = 22.4;
const SMILE_Y = BCY + 16;
const SMILE_W = 44.8;
const SMILE_H = 14.4;
const SMILE_PATH = `M ${BCX - SMILE_W} ${SMILE_Y} Q ${BCX} ${SMILE_Y + SMILE_H * 2} ${BCX + SMILE_W} ${SMILE_Y}`;

function BlobMascot() {
  const popScale    = useRef(new Animated.Value(0)).current;
  const blobRotate  = useRef(new Animated.Value(0)).current;
  const blobY       = useRef(new Animated.Value(0)).current;
  const eyeRy       = useRef(new Animated.Value(EYE_RY)).current;
  const smileScale  = useRef(new Animated.Value(1)).current;
  const spkOpacity  = useRef(new Animated.Value(0)).current;
  const spkScale    = useRef(new Animated.Value(0)).current;

  const blobRotStr = blobRotate.interpolate({
    inputRange: [-8, 0, 8],
    outputRange: ["-8deg", "0deg", "8deg"],
  });

  const smileTransform = smileScale.interpolate({
    inputRange: [1, 1.15],
    outputRange: [
      `translate(${BCX} ${SMILE_Y}) scale(1 1) translate(${-BCX} ${-SMILE_Y})`,
      `translate(${BCX} ${SMILE_Y}) scale(1.15 1) translate(${-BCX} ${-SMILE_Y})`,
    ],
  });

  useEffect(() => {
    Animated.spring(popScale, {
      toValue: 1, useNativeDriver: true, tension: 160, friction: 7,
    }).start(() => {
      Animated.loop(
        Animated.sequence([
          // 1 · lean left
          Animated.timing(blobRotate, { toValue: -8, duration: 450, useNativeDriver: true, easing: Easing.inOut(Easing.quad) }),
          // 2 · eyes close
          Animated.timing(eyeRy, { toValue: 0.8, duration: 200, useNativeDriver: false, easing: Easing.inOut(Easing.quad) }),
          // 3 · smile grows
          Animated.timing(smileScale, { toValue: 1.15, duration: 300, useNativeDriver: false, easing: Easing.inOut(Easing.quad) }),
          // 4 · lean right
          Animated.timing(blobRotate, { toValue: 8, duration: 500, useNativeDriver: true, easing: Easing.inOut(Easing.quad) }),
          // 5 · eyes open (bouncy)
          Animated.timing(eyeRy, { toValue: EYE_RY, duration: 220, useNativeDriver: false, easing: Easing.out(Easing.cubic) }),
          // 6 · snap upright + bounce up
          Animated.parallel([
            Animated.timing(blobRotate, { toValue: 0,  duration: 280, useNativeDriver: true, easing: Easing.out(Easing.cubic) }),
            Animated.timing(blobY,      { toValue: -8, duration: 280, useNativeDriver: true, easing: Easing.out(Easing.cubic) }),
          ]),
          // 7 · sparkles burst
          Animated.parallel([
            Animated.timing(spkOpacity, { toValue: 1, duration: 150, useNativeDriver: true }),
            Animated.timing(spkScale,   { toValue: 1, duration: 150, useNativeDriver: true }),
          ]),
          // land
          Animated.timing(blobY, { toValue: 0, duration: 320, useNativeDriver: true, easing: Easing.in(Easing.quad) }),
          // sparkles fade
          Animated.parallel([
            Animated.timing(spkOpacity, { toValue: 0,   duration: 250, useNativeDriver: true }),
            Animated.timing(spkScale,   { toValue: 0.4, duration: 250, useNativeDriver: true }),
          ]),
          // 8 · smile back to normal
          Animated.timing(smileScale, { toValue: 1, duration: 300, useNativeDriver: false }),
          // idle pause
          Animated.delay(1400),
        ])
      ).start();
    });
  }, []);

  return (
    <View style={{ width: BSIZE + 20, height: BSIZE + 20, alignItems: "center", justifyContent: "center" }}>

      {/* Sparkles */}
      {SPARKLES.map((sp, i) => (
        <Animated.View
          key={i}
          style={{
            position: "absolute",
            left: sp.x,
            top:  sp.y,
            opacity:   spkOpacity,
            transform: [{ scale: spkScale }],
          }}
        >
          <StarSVG size={sp.sz} color={sp.color} />
        </Animated.View>
      ))}

      {/* Blob body — rotates & bounces */}
      <Animated.View
        style={{
          transformOrigin: "center bottom",
          transform: [
            { scale:      popScale },
            { rotate:     blobRotStr },
            { translateY: blobY },
          ],
        }}
      >
        <Svg width={BSIZE} height={BSIZE} viewBox={`0 0 ${BSIZE} ${BSIZE}`}>
          {/* Body */}
          <Circle cx={BCX} cy={BCY} r={BR} fill="#3B82F6" />
          {/* Left eye */}
          <AnimatedEllipse
            cx={BCX - EYE_OX} cy={EYE_Y}
            rx={EYE_RX} ry={eyeRy as any}
            fill="#1E293B"
          />
          {/* Right eye */}
          <AnimatedEllipse
            cx={BCX + EYE_OX} cy={EYE_Y}
            rx={EYE_RX} ry={eyeRy as any}
            fill="#1E293B"
          />
          {/* Smile — scale from centre */}
          <AnimatedG transform={smileTransform as any}>
            <Path
              d={SMILE_PATH}
              stroke="#1E293B"
              strokeWidth={4.5}
              strokeLinecap="round"
              fill="none"
            />
          </AnimatedG>
        </Svg>
      </Animated.View>
    </View>
  );
}

// ─── Shared page header ───────────────────────────────────────────────────────
function PageHeader({
  category, progress, onClose,
}: { category: string; progress: string; onClose: () => void }) {
  return (
    <>
      <View style={s.header}>
        <TouchableOpacity
          style={s.closeBtn}
          onPress={() => { haptic(); onClose(); }}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
          <Ionicons name="close" size={20} color={C.text} />
        </TouchableOpacity>
        <Text style={s.categoryLabel}>{category}</Text>
        <CatBadge />
      </View>
      <View style={s.progressTrack}>
        <View style={[s.progressFill, { width: progress as any }]} />
      </View>
    </>
  );
}

// ─── Fixed bottom button bar ──────────────────────────────────────────────────
// All slides share this bar — content area is flex:1 above it, so y-position stays constant.
function BtnBar({ left, right }: {
  left:  { label: string; style: "outline" | "blue"; onPress: () => void };
  right: { label: string; style: "outline" | "blue"; onPress: () => void };
}) {
  return (
    <View style={s.btnBar}>
      <TouchableOpacity
        style={[s.btn, left.style === "blue" ? s.btnBlue : s.btnOutline]}
        activeOpacity={0.85}
        onPressIn={haptic}
        onPress={left.onPress}
      >
        <Text style={[s.btnText, left.style === "blue" ? s.btnTextWhite : s.btnTextDark]}>
          {left.label}
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[s.btn, right.style === "blue" ? s.btnBlue : s.btnOutline]}
        activeOpacity={0.85}
        onPressIn={haptic}
        onPress={right.onPress}
      >
        <Text style={[s.btnText, right.style === "blue" ? s.btnTextWhite : s.btnTextDark]}>
          {right.label}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

// ─── Screen ───────────────────────────────────────────────────────────────────
interface Props {
  skill: Superskill;
  onClose: () => void;         // X button or "Back to overview"
  onBackToIntro: () => void;   // Back on slide 0 → re-shows intro
  bottomTabBar: React.ReactNode;
}

export default function SuperskillArticleScreen({
  skill, onClose, onBackToIntro, bottomTabBar,
}: Props) {
  const [step, setStep] = useState(0);
  const slides   = SLIDES[skill.id] ?? SLIDES.stress;
  const slide    = slides[step];
  const category = CATEGORY[skill.id] ?? "Self-organization";

  // Progress: intro=25%, slide0=50%, slide1=75%, slide2=100%
  const progress = `${Math.round(((step + 2) / 4) * 100)}%`;

  const goNext = () => { haptic(); setStep(v => v + 1); };
  const goBack = () => {
    haptic();
    if (step === 0) onBackToIntro();
    else setStep(v => v - 1);
  };

  const isCompletion = slide.type === "completion";

  return (
    <View style={s.screen}>
      <StatusBar barStyle="dark-content" />
      <SafeAreaView style={s.safeArea} edges={["top"] as any}>

        <PageHeader category={category} progress={progress} onClose={onClose} />

        {/* ── Content: flex:1 so buttons are always anchored at the same y ── */}
        {isCompletion ? (
          /* Completion: heading pinned at same paddingTop as other slides,
             smiley + achievement centered in the remaining space below */
          <View style={s.completionContent}>
            {(() => {
              const d = slide as DoneSlide;
              return (
                <>
                  <Text style={s.geschafft}>{d.headline}</Text>
                  <View style={s.completionCenter}>
                    <BlobMascot />
                    <Text style={s.achievementText}>{d.achievement}</Text>
                  </View>
                </>
              );
            })()}
          </View>
        ) : (
          /* Text / Video: scrollable title + illustration + body, all white */
          <ScrollView
            style={s.scrollArea}
            contentContainerStyle={s.scrollContent}
            showsVerticalScrollIndicator={false}
          >
            <Text style={s.title}>
              {(slide as TextSlide | VideoSlide).title}
            </Text>

            {/* Full-width illustration */}
            <View style={s.illustrationWrap}>
              <Image
                source={(slide as TextSlide | VideoSlide).illustration}
                style={s.illustration}
                resizeMode={slide.type === "text" ? "contain" : "cover"}
              />
              {slide.type === "video" && (
                <View style={s.playOverlay}>
                  <TouchableOpacity style={[s.playBtn, cardShadow]} activeOpacity={0.8} onPressIn={haptic}>
                    <Ionicons name="play" size={24} color={C.primary} style={{ marginLeft: 3 }} />
                  </TouchableOpacity>
                </View>
              )}
            </View>

            {/* Body text — same white bg as rest of page → seamless */}
            <View style={s.bodyWrap}>
              <RichText segments={(slide as TextSlide | VideoSlide).segments} />
            </View>
          </ScrollView>
        )}

        {/* ── Fixed button bar — always at same y position ── */}
        {isCompletion ? (
          /* Completion uses stacked column buttons */
          <View style={s.completionBtnArea}>
            <TouchableOpacity
              style={[s.btn, s.btnBlue, { flex: undefined, width: "100%" }]}
              activeOpacity={0.85}
              onPressIn={haptic}
              onPress={onClose}
            >
              <Text style={[s.btnText, s.btnTextWhite]}>
                {(slide as DoneSlide).ctaLabel}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[s.btn, s.btnOutline, { flex: undefined, width: "100%", marginTop: 12 }]}
              activeOpacity={0.85}
              onPressIn={haptic}
              onPress={onClose}
            >
              <Text style={[s.btnText, s.btnTextDark]}>Back to overview</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <BtnBar
            left={{  label: "Back", style: "outline", onPress: goBack }}
            right={{ label: "Next", style: "blue",    onPress: goNext }}
          />
        )}

      </SafeAreaView>
      {bottomTabBar}
    </View>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────
const s = StyleSheet.create({
  screen:  { flex: 1, backgroundColor: C.pageBg },
  safeArea: { flex: 1 },

  // ── Header ──
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
    backgroundColor: C.white,
    alignItems: "center",
    justifyContent: "center",
  },
  categoryLabel: {
    flex: 1,
    fontFamily: "Karla_700Bold",
    fontSize: 16,
    color: C.text,
    textAlign: "center",
  },
  catBadge: {
    width: 36, height: 36,
    borderRadius: 18,
    backgroundColor: "#F4F3EB",
    overflow: "hidden",
    alignItems: "center",
    justifyContent: "center",
  },
  catImg: { width: 30, height: 30 },

  // ── Progress ──
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

  // ── Scrollable content ──
  scrollArea: { flex: 1 },
  scrollContent: { paddingBottom: 8 },

  title: {
    fontFamily: "Karla_700Bold",
    fontSize: 28,
    lineHeight: 34,
    color: C.text,
    textAlign: "center",
    letterSpacing: -0.5,
    paddingHorizontal: 24,
    paddingTop: 28,   // unified with intro screen scroll paddingTop
    paddingBottom: 16,
  },

  // Full-width illustration — no border, no bg change → seamless on white page
  illustrationWrap: {
    width: "100%",
    height: 220,
    backgroundColor: C.white, // explicit white so png white bg is indistinguishable
  },
  illustration: { width: "100%", height: "100%" },

  // Play overlay for video slide
  playOverlay: {
    position: "absolute",
    top: 0, left: 0, right: 0, bottom: 0,
    alignItems: "center",
    justifyContent: "center",
  },
  playBtn: {
    width: 56, height: 56,
    borderRadius: 28,
    backgroundColor: C.white,
    alignItems: "center",
    justifyContent: "center",
  },

  // Body text — white bg (matches page), no visual panel break
  bodyWrap: {
    paddingHorizontal: 24,
    paddingTop: 20,
  },
  body: {
    fontFamily: "Karla_400Regular",
    fontSize: 16,
    lineHeight: 26,
    color: C.text,
    textAlign: "center",
  },
  bodyBold: { fontFamily: "Karla_700Bold" },

  // ── Fixed bottom button bar (text + video slides) ──
  btnBar: {
    flexDirection: "row",
    gap: 12,
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 20,
    backgroundColor: C.white,
  },
  btn: {
    flex: 1,
    height: 52,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    // grey hard shadow below every button — both filled and outline
    shadowColor: "#CACACA",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 3,
  },
  btnBlue:    { backgroundColor: C.primary },
  btnOutline: {
    backgroundColor: C.white,
    borderWidth: 1,
    borderColor: C.border,
  },
  btnText:      { fontFamily: "Karla_700Bold", fontSize: 16 },
  btnTextWhite: { color: C.white },
  btnTextDark:  { color: C.text },

  // ── Completion screen ──
  completionContent: {
    flex: 1,
    paddingHorizontal: 24,
  },
  // "Geschafft!" heading — same paddingTop as text/video slide titles
  geschafft: {
    fontFamily: "Caveat_700Bold",
    fontSize: 52,
    color: C.primary,
    textAlign: "center",
    paddingTop: 28,
    paddingBottom: 0,
  },
  // Smiley + achievement text centered in the space below the heading
  completionCenter: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 20,
  },
  // smileyImg replaced by BlobMascot component
  achievementText: {
    fontFamily: "Karla_400Regular",
    fontSize: 15,
    lineHeight: 22,
    color: C.muted,
    textAlign: "center",
  },

  // Completion CTAs — same bottom band as btnBar, no separator line
  completionBtnArea: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 20,
    backgroundColor: C.white,
  },
});
