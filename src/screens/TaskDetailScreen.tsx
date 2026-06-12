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
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { C, T, cardShadow } from "../theme";
import type { Task } from "./TopicDetailScreen";
import * as ImagePicker from "expo-image-picker";

const haptic = () => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

// ─── Task variants ─────────────────────────────────────────────────────────────
interface TaskVariant {
  question: string;
  math: string;
  scenario: string;
  duration: number;
  relevance: number;
}

const SIMILAR_TASKS: TaskVariant[] = [
  {
    question: "Your turn! Write the equation of an exponential function in the form",
    math: "y = k · aˣ",
    scenario: "Jamal puts €100 into a stock fund every month. His money grows by 7% each year. How much will Jamal have saved after 20 years?",
    duration: 8, relevance: 87,
  },
  {
    question: "Set up an exponential function in the form",
    math: "f(x) = a · bˣ",
    scenario: "A town has 12,000 residents. Every year the population shrinks by 3%. Write a function for the number of residents after x years.",
    duration: 10, relevance: 79,
  },
  {
    question: "Write an exponential growth function of the form",
    math: "y = a · (1 + r)ˣ",
    scenario: "Sara deposits €500 in a savings account with 2.5% annual interest. How much will she have after x years?",
    duration: 9, relevance: 83,
  },
  {
    question: "Model the situation with an exponential function",
    math: "N(t) = N₀ · aᵗ",
    scenario: "A bacteria culture starts with 200 cells and doubles every 4 hours. How many cells are there after t hours?",
    duration: 12, relevance: 71,
  },
  {
    question: "Find an exponential function in the form",
    math: "f(x) = c · qˣ",
    scenario: "A used car costs €18,000 today. Its value drops by 15% every year. What is the car worth after x years?",
    duration: 11, relevance: 75,
  },
  {
    question: "Write an exponential decay function in the form",
    math: "f(t) = a · bᵗ",
    scenario: "A radioactive substance has a half-life of 8 years. You start with 500 grams. Write a function for the remaining amount after t years, and find how much is left after 24 years.",
    duration: 13, relevance: 68,
  },
];

// ─── Step-by-step guided answers ──────────────────────────────────────────────
interface AnswerStep {
  title: string;
  body: string;
  math?: string;
}

const ANSWER_STEPS: AnswerStep[][] = [
  // variant 0 — Jamal, 7% growth
  [
    {
      title: "Step 1 · What do you know?",
      body: "Read the problem and pick out the numbers:\n• Starting amount: k = €100\n• Growth rate: 7% per year → growth factor a = 1 + 0.07 = 1.07\n• x = number of years",
    },
    {
      title: "Step 2 · Write the formula",
      body: "Plug your values into the general form:",
      math: "y = k · aˣ  →  y = 100 · 1.07ˣ",
    },
    {
      title: "Step 3 · Calculate for 20 years",
      body: "Substitute x = 20 into your formula:",
      math: "y = 100 · 1.07²⁰ ≈ 100 · 3.87 ≈ €387",
    },
    {
      title: "Step 4 · Label your variables",
      body: "Always explain what the letters mean — it's worth marks!\n• y = total value in €\n• x = years elapsed\n• k = €100 (starting amount)\n• a = 1.07 (growth factor per year)",
    },
  ],
  // variant 1 — shrinking town, 3% decay
  [
    {
      title: "Step 1 · What do you know?",
      body: "Pick out the numbers:\n• Starting population: a = 12,000\n• Shrinks by 3% each year → decay factor b = 1 − 0.03 = 0.97\n• x = number of years",
    },
    {
      title: "Step 2 · Write the formula",
      body: "Use the exponential form:",
      math: "f(x) = a · bˣ  →  f(x) = 12,000 · 0.97ˣ",
    },
    {
      title: "Step 3 · Check: growth or decay?",
      body: "Because b = 0.97 is less than 1, the function decreases over time. ✅ That matches a shrinking population.",
    },
    {
      title: "Step 4 · Label your variables",
      body: "• f(x) = number of residents after x years\n• a = 12,000 (starting population)\n• b = 0.97 (decay factor — less than 1 = decrease)",
    },
  ],
  // variant 2 — Sara €500, 2.5% interest
  [
    {
      title: "Step 1 · What do you know?",
      body: "Pick out the numbers:\n• Initial deposit: a = €500\n• Annual interest rate: r = 2.5% = 0.025\n• Growth factor = 1 + r = 1.025\n• x = number of years",
    },
    {
      title: "Step 2 · Write the formula",
      body: "Plug into the standard compound interest form:",
      math: "y = a · (1 + r)ˣ  →  y = 500 · 1.025ˣ",
    },
    {
      title: "Step 3 · Check it makes sense",
      body: "After 1 year: y = 500 · 1.025 = €512.50. That's €500 plus 2.5% interest. ✅ Looks right!",
    },
    {
      title: "Step 4 · Label your variables",
      body: "• y = total savings in €\n• x = years\n• a = €500 (starting deposit)\n• r = 0.025 (interest rate)\n• 1 + r = 1.025 (growth factor)",
    },
  ],
  // variant 3 — bacteria doubling every 4 h
  [
    {
      title: "Step 1 · What do you know?",
      body: "Pick out the numbers:\n• Starting cells: N₀ = 200\n• Doubles every 4 hours → base = 2\n• t = time in hours",
    },
    {
      title: "Step 2 · Watch out — the time unit!",
      body: "Doubling happens every 4 hours, not every 1 hour. So the exponent is t ÷ 4, not just t.",
      math: "N(t) = 200 · 2^(t/4)",
    },
    {
      title: "Step 3 · Check with t = 4",
      body: "After 4 hours: N(4) = 200 · 2^(4/4) = 200 · 2¹ = 400 cells. That's exactly double. ✅",
    },
    {
      title: "Step 4 · Label your variables",
      body: "• N(t) = number of cells after t hours\n• 200 = starting number of cells\n• 2 = doubling factor\n• t/4 = because doubling happens every 4 hours",
    },
  ],
  // variant 4 — car €18,000, −15%/year
  [
    {
      title: "Step 1 · What do you know?",
      body: "Pick out the numbers:\n• Starting value: c = €18,000\n• Loses 15% per year → decay factor q = 1 − 0.15 = 0.85\n• x = number of years",
    },
    {
      title: "Step 2 · Write the formula",
      body: "Plug into the general exponential form:",
      math: "f(x) = c · qˣ  →  f(x) = 18,000 · 0.85ˣ",
    },
    {
      title: "Step 3 · Check: growth or decay?",
      body: "q = 0.85 is less than 1 → the value decreases every year. ✅ That makes sense for a car losing value.",
    },
    {
      title: "Step 4 · Label your variables",
      body: "• f(x) = car value in € after x years\n• c = €18,000 (starting price)\n• q = 0.85 (decay factor — 85% of value stays each year)",
    },
  ],
  // variant 5 — radioactive half-life
  [
    {
      title: "Step 1 · What do you know?",
      body: "Pick out the numbers:\n• Starting amount: a = 500 g\n• Half-life = 8 years → every 8 years the amount halves → base b = 0.5\n• t = time in years",
    },
    {
      title: "Step 2 · Watch out — the time unit!",
      body: "Halving happens every 8 years, not every year. So the exponent is t ÷ 8.",
      math: "f(t) = 500 · 0.5^(t/8)",
    },
    {
      title: "Step 3 · Calculate for 24 years",
      body: "Substitute t = 24:",
      math: "f(24) = 500 · 0.5^(24/8) = 500 · 0.5³ = 500 · 0.125 = 62.5 g",
    },
    {
      title: "Step 4 · Label your variables",
      body: "• f(t) = remaining grams after t years\n• 500 = starting amount (g)\n• 0.5 = half-life base (amount halves each period)\n• t/8 = because halving happens every 8 years",
    },
  ],
];

const AI_FEEDBACK = [
  "Good start! Your function setup is correct. Double-check the value of k — it should reflect the initial amount, not the monthly contribution.",
  "Nice work identifying the base b = 0.97. Your equation structure is right, but make sure x represents years, not months.",
  "You've got the right idea! The formula y = a · (1+r)ˣ fits perfectly here. Just verify your calculation by substituting the known values back in.",
  "Great effort! The exponential structure is spot on. One tip: clearly state what t and N stand for — that's worth marks in an exam.",
  "Almost there! Your base value is correct. Now check whether the context calls for growth or decay — and adjust the formula accordingly.",
  "Nice work tackling the half-life! The key trick is t/8 in the exponent. Double-check your calculation for t = 24 by counting how many half-lives fit in 24 years.",
];

const TOTAL_EXERCISES = SIMILAR_TASKS.length; // 6

// ─── Step card — fades + slides up on mount ────────────────────────────────────
function StepCard({ step, index }: { step: AnswerStep; index: number }) {
  const opacity    = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(18)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(opacity, {
        toValue: 1, duration: 320, useNativeDriver: true,
      }),
      Animated.spring(translateY, {
        toValue: 0, useNativeDriver: true, tension: 120, friction: 14,
      }),
    ]).start();
  }, []);

  return (
    <Animated.View style={{ opacity, transform: [{ translateY }] }}>
      <View style={[s.card, cardShadow, s.stepCard]}>
        <View style={s.stepHeader}>
          <View style={s.stepBadge}>
            <Text style={s.stepBadgeNum}>{index + 1}</Text>
          </View>
          <Text style={s.stepTitle}>{step.title}</Text>
        </View>
        <Text style={s.stepBody}>{step.body}</Text>
        {step.math && (
          <View style={s.mathBox}>
            <Text style={s.mathText}>{step.math}</Text>
          </View>
        )}
      </View>
    </Animated.View>
  );
}

// ─── Screen ───────────────────────────────────────────────────────────────────
interface Props {
  task: Task;
  onClose: () => void;
  onComplete: () => void;
  bottomTabBar: React.ReactNode;
}

type FeedbackOption = "nope" | "got-it";

export default function TaskDetailScreen({ task, onClose, onComplete, bottomTabBar }: Props) {
  const [feedback, setFeedback] = React.useState<FeedbackOption | null>(null);
  const [variantIdx, setVariantIdx] = React.useState(0);
  const variant = SIMILAR_TASKS[variantIdx];
  const [capturedPhoto, setCapturedPhoto] = React.useState<string | null>(null);
  const [showAnswer, setShowAnswer] = React.useState(false);
  const [revealedSteps, setRevealedSteps] = React.useState(0);
  const scrollRef = useRef<ScrollView>(null);

  const pickPhoto = async () => {
    haptic();
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.8,
    });
    if (!result.canceled && result.assets[0]) {
      setCapturedPhoto(result.assets[0].uri);
      setTimeout(() => scrollRef.current?.scrollToEnd({ animated: true }), 300);
    }
  };

  const STEP_DELAY_MS = 900; // pause between each step appearing

  const handleShowAnswer = () => {
    haptic();
    setShowAnswer(true);
    setRevealedSteps(0);
    const steps = ANSWER_STEPS[variantIdx];
    steps.forEach((_, i) => {
      setTimeout(() => {
        setRevealedSteps(i + 1);
        setTimeout(() => scrollRef.current?.scrollToEnd({ animated: true }), 80);
      }, i * STEP_DELAY_MS);
    });
  };

  const selectFeedback = (opt: FeedbackOption) => {
    haptic();
    setFeedback(prev => prev === opt ? null : opt);
  };

  return (
    <View style={s.screen}>
      <StatusBar barStyle="dark-content" />
      <SafeAreaView style={s.safeArea} edges={["top"] as any}>

        {/* ── Header ── */}
        <View style={s.header}>
          <TouchableOpacity
            style={s.closeBtn}
            onPress={() => { haptic(); onClose(); }}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            <Ionicons name="close" size={20} color={C.text} />
          </TouchableOpacity>
          <Text style={s.headerTitle} numberOfLines={2}>{task.title}</Text>
          <View style={s.badge}>
            <Text style={s.badgeEmoji}>🤓</Text>
          </View>
        </View>

        {/* ── Progress bar ── */}
        <View style={s.progressTrack}>
          <View style={[s.progressFill, { width: `${Math.round(((variantIdx + 1) / TOTAL_EXERCISES) * 100)}%` as any }]} />
        </View>

        {/* ── Scrollable content ── */}
        <ScrollView
          ref={scrollRef}
          style={s.scroll}
          contentContainerStyle={s.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Meta row */}
          <View style={s.metaRow}>
            <Ionicons name="time-outline" size={14} color={C.muted} />
            <Text style={[T.body14, { color: C.muted }]}>{variant.duration}min</Text>
            <View style={s.metaDivider} />
            <Ionicons name="document-outline" size={14} color={C.muted} />
            <Text style={[T.body14, { color: C.muted }]}>{variant.relevance}% relevant</Text>
          </View>

          {/* Question card */}
          <View style={[s.card, cardShadow]}>
            <Text style={s.cardText}>
              {variant.question}{" "}
              <Text style={s.cardMath}>{variant.math}</Text>
              {" "}that fits the situation below. Also explain what the variables stand for.
            </Text>
          </View>

          {/* Context card */}
          <View style={[s.contextCard, cardShadow]}>
            <Text style={s.contextText}>{variant.scenario}</Text>
          </View>

          {/* Hint */}
          <Text style={s.hint}>No calculator needed — grab a pen and paper! ✏️</Text>

          {/* Photo + AI feedback */}
          {capturedPhoto && (
            <>
              <View style={[s.photoWrap, cardShadow]}>
                <Image source={{ uri: capturedPhoto }} style={s.photo} resizeMode="cover" />
              </View>
              <View style={[s.card, cardShadow, s.aiFeedbackCard]}>
                <View style={s.aiHeader}>
                  <View style={s.aiAvatar}>
                    <Image
                      source={require("../../assets/cards/cat meditating.png")}
                      style={{ width: 28, height: 28 }}
                      resizeMode="contain"
                    />
                  </View>
                  <Text style={s.aiLabel}>AI feedback</Text>
                </View>
                <Text style={s.cardText}>{AI_FEEDBACK[variantIdx]}</Text>
              </View>
            </>
          )}

          {/* ── Step-by-step guided answer ── */}
          {showAnswer && (
            <>
              <View style={s.answerHeader}>
                <View style={s.aiAvatar}>
                  <Image
                    source={require("../../assets/cards/cat meditating.png")}
                    style={{ width: 28, height: 28 }}
                    resizeMode="contain"
                  />
                </View>
                <Text style={s.answerLabel}>Here's how to solve it — step by step 👇</Text>
              </View>
              {ANSWER_STEPS[variantIdx].slice(0, revealedSteps).map((step, i) => (
                <StepCard key={i} step={step} index={i} />
              ))}
              {revealedSteps >= ANSWER_STEPS[variantIdx].length && (
                <View style={[s.card, cardShadow, s.botFeedbackCard]}>
                  <View style={s.aiHeader}>
                    <View style={s.aiAvatar}>
                      <Image
                        source={require("../../assets/cards/cat meditating.png")}
                        style={{ width: 28, height: 28 }}
                        resizeMode="contain"
                      />
                    </View>
                    <Text style={s.aiLabel}>AI tutor</Text>
                  </View>
                  <Text style={s.cardText}>
                    Got it? Let me know — I'll adjust the next task accordingly.
                  </Text>
                  <View style={s.botFeedbackRow}>
                    <TouchableOpacity
                      style={[s.feedbackBtn, feedback === "nope" && s.feedbackBtnActive]}
                      activeOpacity={0.8}
                      onPress={() => selectFeedback("nope")}
                    >
                      <Text style={s.feedbackEmoji}>😔</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={[s.feedbackBtn, feedback === "got-it" && s.feedbackBtnActive]}
                      activeOpacity={0.8}
                      onPress={() => selectFeedback("got-it")}
                    >
                      <Text style={s.feedbackEmoji}>😊</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              )}
            </>
          )}
        </ScrollView>

        {/* ── Fixed bottom buttons ── */}
        <View style={s.btnArea}>
          <TouchableOpacity
            style={[s.btn, s.btnBlue]}
            activeOpacity={0.85}
            onPress={pickPhoto}
          >
            <Text style={s.btnTextWhite}>Check my answer</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[s.btn, s.btnDark]}
            activeOpacity={0.85}
            onPress={handleShowAnswer}
          >
            <Text style={s.btnTextWhite}>Show me the answer</Text>
          </TouchableOpacity>
        </View>

        {/* ── Next / Finish button — terminal action, lowest fixed zone ── */}
        {(() => {
          const isLast = variantIdx === TOTAL_EXERCISES - 1;
          return (
            <View style={s.nextBar}>
              <TouchableOpacity
                style={[s.btn, isLast ? s.btnFinish : s.btnNext]}
                activeOpacity={0.85}
                onPress={() => {
                  haptic();
                  if (isLast) {
                    onComplete();
                  } else {
                    setVariantIdx(i => i + 1);
                    setFeedback(null);
                    setCapturedPhoto(null);
                    setShowAnswer(false);
                    setRevealedSteps(0);
                    scrollRef.current?.scrollTo({ y: 0, animated: true });
                  }
                }}
              >
                <Text style={[s.btnNextText, isLast && s.btnFinishText]}>
                  {isLast ? "I crushed it! 🎉" : "Next task"}
                </Text>
                {!isLast && (
                  <Ionicons name="arrow-forward" size={18} color={C.text} style={{ marginLeft: 6 }} />
                )}
              </TouchableOpacity>
            </View>
          );
        })()}

      </SafeAreaView>
      {bottomTabBar}
    </View>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────
const s = StyleSheet.create({
  screen:   { flex: 1, backgroundColor: C.pageBg },
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
  headerTitle: {
    flex: 1,
    fontFamily: "Karla_700Bold",
    fontSize: 15,
    lineHeight: 20,
    color: C.text,
    textAlign: "center",
    paddingHorizontal: 8,
  },
  badge: {
    width: 36, height: 36,
    borderRadius: 18,
    backgroundColor: C.offWhite,
    alignItems: "center",
    justifyContent: "center",
  },
  badgeEmoji: { fontSize: 20 },

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

  // ── Scroll ──
  scroll: { flex: 1 },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 20,
    paddingBottom: 24,
    gap: 14,
  },

  // ── Meta row ──
  metaRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  metaDivider: {
    width: 1,
    height: 12,
    backgroundColor: C.border,
    marginHorizontal: 4,
  },

  // ── Cards ──
  card: {
    backgroundColor: C.white,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: C.border,
  },
  cardText: {
    fontFamily: "Karla_400Regular",
    fontSize: 15,
    lineHeight: 24,
    color: C.text,
  },
  cardMath: { fontFamily: "Karla_700Bold" },

  contextCard: {
    backgroundColor: C.offWhite,
    borderRadius: 16,
    padding: 16,
  },
  contextText: {
    fontFamily: "Karla_700Bold",
    fontSize: 15,
    lineHeight: 24,
    color: C.text,
  },

  // ── Hint ──
  hint: {
    fontFamily: "Karla_400Regular",
    fontSize: 13,
    lineHeight: 18,
    color: C.muted,
  },

  // ── Photo + AI feedback ──
  photoWrap: {
    width: "100%",
    height: 260,
    borderRadius: 16,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: C.border,
  },
  photo: { width: "100%", height: "100%" },
  aiFeedbackCard: { gap: 12 },
  aiHeader: { flexDirection: "row", alignItems: "center", gap: 8 },
  aiAvatar: {
    width: 36, height: 36,
    borderRadius: 18,
    backgroundColor: C.primary,
    alignItems: "center",
    justifyContent: "center",
  },
  aiLabel: {
    fontFamily: "Karla_700Bold",
    fontSize: 14,
    color: C.primary,
  },

  // ── Step-by-step answer ──
  answerHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingBottom: 4,
  },
  answerLabel: {
    flex: 1,
    fontFamily: "Karla_700Bold",
    fontSize: 15,
    lineHeight: 22,
    color: C.text,
  },
  stepCard: {
    gap: 10,
  },
  stepHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  stepBadge: {
    width: 28, height: 28,
    borderRadius: 14,
    backgroundColor: C.primary,
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  stepBadgeNum: {
    fontFamily: "Karla_700Bold",
    fontSize: 14,
    color: C.white,
  },
  stepTitle: {
    fontFamily: "Karla_700Bold",
    fontSize: 14,
    color: C.text,
    flex: 1,
  },
  stepBody: {
    fontFamily: "Karla_400Regular",
    fontSize: 14,
    lineHeight: 22,
    color: C.text,
  },
  mathBox: {
    backgroundColor: "#EEF3FF",
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  mathText: {
    fontFamily: "Karla_700Bold",
    fontSize: 15,
    color: C.primary,
    textAlign: "center",
    letterSpacing: 0.3,
  },
  // ── Bot feedback card — appears after all steps are revealed ──
  botFeedbackCard: {
    gap: 12,
  },
  botFeedbackRow: {
    flexDirection: "row",
    gap: 10,
  },
  feedbackBtn: {
    width: 44, height: 44,
    borderRadius: 22,
    borderWidth: 1.5,
    borderColor: C.border,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: C.offWhite,
  },
  feedbackBtnActive: {
    borderColor: C.primary,
    borderWidth: 2,
    backgroundColor: "#EEF3FF",
  },
  feedbackEmoji: {
    fontSize: 22,
  },

  // ── Fixed bottom buttons ──
  btnArea: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 10,
    gap: 10,
    backgroundColor: C.white,
  },
  btn: {
    width: "100%",
    height: 52,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#CACACA",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 3,
  },
  btnBlue: { backgroundColor: C.primary },
  btnDark: { backgroundColor: C.primaryDark },
  btnTextWhite: {
    fontFamily: "Karla_700Bold",
    fontSize: 16,
    color: C.white,
  },

  // ── Next task bar — terminal action ──
  nextBar: {
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 20,
    backgroundColor: C.white,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: C.border,
  },
  btnNext: {
    backgroundColor: C.white,
    borderWidth: 1.5,
    borderColor: C.border,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  btnNextText: {
    fontFamily: "Karla_700Bold",
    fontSize: 16,
    color: C.text,
  },
  // Final exercise — celebration style
  btnFinish: {
    backgroundColor: "#22C55E",   // green
    borderWidth: 0,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  btnFinishText: {
    color: C.white,
  },
});
