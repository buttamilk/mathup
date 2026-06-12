import React, { useRef, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  Animated,
  Pressable,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { C, cardShadow } from "../theme";
import type { Task } from "./TopicDetailScreen";

const haptic = () => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

// ─── Confidence levels ────────────────────────────────────────────────────────
const CONFIDENCE_LEVELS = [
  { id: "low",  emoji: "😟", label: "Still figuring it out", desc: "I need more practice"       },
  { id: "mid",  emoji: "😌", label: "Getting there",         desc: "I understand the basics"     },
  { id: "high", emoji: "🤓", label: "Got it!",               desc: "I can solve these on my own" },
] as const;
type ConfidenceId = typeof CONFIDENCE_LEVELS[number]["id"];

// ─── Confidence bottom sheet ──────────────────────────────────────────────────
function ConfidenceSheet({
  visible, selected, onSelect, onConfirm, onDismiss,
}: {
  visible: boolean;
  selected: ConfidenceId | null;
  onSelect: (id: ConfidenceId) => void;
  onConfirm: () => void;
  onDismiss: () => void;
}) {
  const slideY          = useRef(new Animated.Value(480)).current;
  const backdropOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.spring(slideY,          { toValue: 0, useNativeDriver: true, tension: 80, friction: 14 }),
        Animated.timing(backdropOpacity, { toValue: 1, useNativeDriver: true, duration: 250 }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(slideY,          { toValue: 480, useNativeDriver: true, duration: 260 }),
        Animated.timing(backdropOpacity, { toValue: 0,   useNativeDriver: true, duration: 220 }),
      ]).start();
    }
  }, [visible]);

  return (
    <View style={StyleSheet.absoluteFill} pointerEvents={visible ? "auto" : "none"}>
      <Animated.View style={[s.backdrop, { opacity: backdropOpacity }]}>
        <Pressable style={StyleSheet.absoluteFill} onPress={onDismiss} />
      </Animated.View>

      <Animated.View style={[s.sheet, { transform: [{ translateY: slideY }] }]}>
        <View style={s.dragHandle} />

        <Text style={s.sheetTitle}>How confident do you feel?</Text>
        <Text style={s.sheetSub}>Your answer helps us adjust your next session.</Text>

        <View style={s.confRow}>
          {CONFIDENCE_LEVELS.map((level) => {
            const active = selected === level.id;
            return (
              <TouchableOpacity
                key={level.id}
                style={[s.confCard, active && s.confCardActive]}
                activeOpacity={0.8}
                onPress={() => { haptic(); onSelect(level.id); }}
              >
                <Text style={s.confEmoji}>{level.emoji}</Text>
                <Text style={[s.confLabel, active && s.confLabelActive]}>{level.label}</Text>
                <Text style={[s.confDesc,  active && s.confDescActive]}>{level.desc}</Text>
              </TouchableOpacity>
            );
          })}
        </View>

        <TouchableOpacity
          style={[s.btn, s.btnBlue, !selected && s.btnDisabled]}
          activeOpacity={selected ? 0.85 : 1}
          onPress={() => { if (selected) { haptic(); onConfirm(); } }}
        >
          <Text style={s.btnTextWhite}>Save my confidence level</Text>
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
}

// ─── Screen ───────────────────────────────────────────────────────────────────
interface Props {
  task: Task;
  correctCount?: number;
  totalCount?: number;
  onClose: () => void;
  onKeepPractising: () => void;
}

export default function ExerciseSummaryScreen({
  task,
  correctCount = 4,
  totalCount   = 6,
  onClose,
  onKeepPractising,
}: Props) {
  const [showSheet,   setShowSheet]   = React.useState(false);
  const [confidence,  setConfidence]  = React.useState<ConfidenceId | null>(null);
  const [pendingConf, setPendingConf] = React.useState<ConfidenceId | null>(null);

  // Hero score: scale + fade in on mount
  const heroScale   = useRef(new Animated.Value(0.7)).current;
  const heroOpacity = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.parallel([
      Animated.spring(heroScale,   { toValue: 1, useNativeDriver: true, tension: 130, friction: 9 }),
      Animated.timing(heroOpacity, { toValue: 1, duration: 380, useNativeDriver: true }),
    ]).start();
  }, []);

  const pct      = correctCount / totalCount;
  const autoConf: ConfidenceId = pct >= 0.8 ? "high" : pct >= 0.5 ? "mid" : "low";
  const savedLevel  = CONFIDENCE_LEVELS.find(c => c.id === (confidence ?? autoConf))!;

  const handleConfirm = () => {
    setConfidence(pendingConf);
    setShowSheet(false);
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
          <View style={s.headerBadge}>
            <Text style={{ fontSize: 20 }}>{savedLevel.emoji}</Text>
          </View>
        </View>

        {/* ── Progress bar — 100% complete ── */}
        <View style={s.progressTrack}>
          <View style={s.progressFill} />
        </View>

        {/* ── Scroll ── */}
        <ScrollView
          style={s.scroll}
          contentContainerStyle={s.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Headline — matches superskill completion */}
          <Text style={s.headline}>Well done!</Text>

          {/* ── Hero score — floats freely, no card ── */}
          <Animated.View style={[s.heroWrap, { opacity: heroOpacity, transform: [{ scale: heroScale }] }]}>
            <Text style={s.heroNumber}>{correctCount} / {totalCount}</Text>
            <Text style={s.heroSub}>exercises completed</Text>

            {/* Auto-detected confidence pill */}
            <View style={s.confPill}>
              <Text style={s.confPillEmoji}>{savedLevel.emoji}</Text>
              <Text style={s.confPillLabel}>{savedLevel.label}</Text>
              {confidence && (
                <View style={s.confPillCheck}>
                  <Ionicons name="checkmark-circle" size={14} color="#22C55E" />
                </View>
              )}
            </View>
          </Animated.View>

          {/* ── Confidence CTA ── */}
          <TouchableOpacity
            style={[s.btn, s.btnBlue]}
            activeOpacity={0.85}
            onPress={() => { haptic(); setPendingConf(confidence); setShowSheet(true); }}
          >
            <Text style={s.btnTextWhite}>
              {confidence ? "Update my confidence level" : "How confident do you feel?"}
            </Text>
          </TouchableOpacity>

          {/* ── Skills + Gaps in one card ── */}
          <View style={[s.card, cardShadow, { marginTop: 8 }]}>
            {/* New skills learned */}
            <View style={s.cardSection}>
              <View style={s.sectionHead}>
                <View style={[s.sectionDot, { backgroundColor: C.primary }]} />
                <Text style={s.sectionTitle}>New skills learned</Text>
              </View>
              <SkillRow label="Comparing growth rates"          type="learned" />
              <SkillRow label="Interpreting exponential graphs" type="learned" />
            </View>

            <View style={s.cardDivider} />

            {/* Worth revisiting */}
            <View style={s.cardSection}>
              <View style={s.sectionHead}>
                <View style={[s.sectionDot, { backgroundColor: "#D97706" }]} />
                <Text style={s.sectionTitle}>Worth revisiting</Text>
              </View>
              <SkillRow label="Solving logarithmic equations" type="gap" />
              <SkillRow label="Compound interest calculations" type="gap" />
            </View>
          </View>

          {/* ── Badge card ── */}
          <View style={[s.badgeCard, cardShadow]}>
            <Text style={s.badgeEyebrow}>Badge unlocked</Text>
            <Text style={s.badgeIcon}>🌱</Text>
            <Text style={s.badgeName}>Growth Explorer</Text>
            <Text style={s.badgeDesc}>Exponential functions module completed</Text>
          </View>

        </ScrollView>

        {/* ── Fixed bottom buttons ── */}
        <View style={s.btnArea}>
          <TouchableOpacity
            style={[s.btn, s.btnOutline, { flex: 1 }]}
            activeOpacity={0.85}
            onPress={() => { haptic(); onKeepPractising(); }}
          >
            <Text style={s.btnTextDark}>Keep practising</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[s.btn, s.btnBlue, { flex: 1 }]}
            activeOpacity={0.85}
            onPress={() => { haptic(); onClose(); }}
          >
            <Text style={s.btnTextWhite}>Back to overview</Text>
          </TouchableOpacity>
        </View>

      </SafeAreaView>

      <ConfidenceSheet
        visible={showSheet}
        selected={pendingConf}
        onSelect={setPendingConf}
        onConfirm={handleConfirm}
        onDismiss={() => setShowSheet(false)}
      />
    </View>
  );
}

// ─── Skill row — plain list item, consistent with card text patterns ─────────
function SkillRow({ label, type }: { label: string; type: "learned" | "gap" }) {
  const learned = type === "learned";
  return (
    <View style={s.skillRow}>
      <Ionicons
        name={learned ? "checkmark-circle" : "alert-circle-outline"}
        size={16}
        color={learned ? C.primary : "#D97706"}
      />
      <Text style={[s.skillLabel, !learned && s.skillLabelGap]}>{label}</Text>
    </View>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────
const s = StyleSheet.create({
  screen:   { flex: 1, backgroundColor: C.pageBg },
  safeArea: { flex: 1 },

  // ── Header (identical pattern to every other screen) ──
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 12,
  },
  closeBtn: {
    width: 36, height: 36, borderRadius: 18,
    borderWidth: 1, borderColor: C.border,
    backgroundColor: C.white,
    alignItems: "center", justifyContent: "center",
  },
  headerTitle: {
    flex: 1,
    fontFamily: "Karla_700Bold", fontSize: 15, lineHeight: 20,
    color: C.text, textAlign: "center", paddingHorizontal: 8,
  },
  headerBadge: {
    width: 36, height: 36, borderRadius: 18,
    backgroundColor: C.offWhite,
    alignItems: "center", justifyContent: "center",
  },

  // ── Progress ──
  progressTrack: {
    marginHorizontal: 16, height: 6,
    backgroundColor: C.offWhite, borderRadius: 3, overflow: "hidden",
  },
  progressFill: {
    width: "100%", height: 6,
    backgroundColor: C.primary, borderRadius: 3,
  },

  // ── Scroll ──
  scroll: { flex: 1 },
  scrollContent: {
    paddingHorizontal: 16, paddingTop: 28, paddingBottom: 20, gap: 16,
  },

  // ── Headline (matches SuperskillArticleScreen "Well done!") ──
  headline: {
    fontFamily: "Caveat_700Bold",
    fontSize: 52, lineHeight: 56,
    color: C.primary, textAlign: "center",
  },

  // ── Hero score — free-floating, no card ──
  heroWrap: {
    alignItems: "center",
    paddingVertical: 8,
    gap: 4,
  },
  heroNumber: {
    fontFamily: "Karla_700Bold",
    fontSize: 56, letterSpacing: -2, lineHeight: 60,
    color: C.primary,
  },
  heroSub: {
    fontFamily: "Karla_400Regular",
    fontSize: 15, color: C.muted,
  },
  // Auto-confidence pill sits below the score
  confPill: {
    flexDirection: "row", alignItems: "center", gap: 6,
    marginTop: 12,
    paddingHorizontal: 14, paddingVertical: 7,
    borderRadius: 20,
    borderWidth: 1, borderColor: C.border,
    backgroundColor: C.white,
  },
  confPillEmoji: { fontSize: 16 },
  confPillLabel: {
    fontFamily: "Karla_700Bold", fontSize: 14, color: C.text,
  },
  confPillCheck: { marginLeft: 2 },

  // ── Shared card ──
  card: {
    backgroundColor: C.white,
    borderRadius: 16,
    borderWidth: 1, borderColor: C.border,
    overflow: "hidden",
  },
  cardSection: { padding: 16, gap: 12 },
  cardDivider: { height: StyleSheet.hairlineWidth, backgroundColor: C.border },

  // ── Section heads inside card ──
  sectionHead: { flexDirection: "row", alignItems: "center", gap: 8 },
  sectionDot:  { width: 8, height: 8, borderRadius: 4 },
  sectionTitle: {
    fontFamily: "Karla_700Bold", fontSize: 15, color: C.text,
  },

  // ── Skill rows (icon + label, same pattern as step card body text) ──
  skillRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  skillLabel: {
    fontFamily: "Karla_400Regular",
    fontSize: 15, lineHeight: 22,
    color: C.text, flex: 1,
  },
  skillLabelGap: { color: C.text },

  // ── Badge card (offWhite, same beige token used throughout) ──
  badgeCard: {
    backgroundColor: C.offWhite,
    borderRadius: 16,
    padding: 24,
    alignItems: "center", gap: 4,
  },
  badgeEyebrow: {
    fontFamily: "Karla_700Bold", fontSize: 12,
    color: C.muted, letterSpacing: 0.5,
  },
  badgeIcon: { fontSize: 48, lineHeight: 56, marginTop: 4 },
  badgeName: {
    fontFamily: "Caveat_700Bold", fontSize: 30,
    color: C.primary, marginTop: 4,
  },
  badgeDesc: {
    fontFamily: "Karla_400Regular", fontSize: 13, lineHeight: 18,
    color: C.muted, textAlign: "center",
  },

  // ── Buttons (identical spec to every other screen) ──
  btnArea: {
    flexDirection: "row", gap: 12,
    paddingHorizontal: 16, paddingTop: 12, paddingBottom: 20,
    backgroundColor: C.white,
    borderTopWidth: StyleSheet.hairlineWidth, borderTopColor: C.border,
  },
  btn: {
    height: 52, borderRadius: 16,
    alignItems: "center", justifyContent: "center",
    shadowColor: "#CACACA", shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 1, shadowRadius: 0, elevation: 3,
  },
  btnBlue:    { backgroundColor: C.primary },
  btnOutline: { backgroundColor: C.white, borderWidth: 1, borderColor: C.border },
  btnDisabled: { opacity: 0.4 },
  btnTextWhite: { fontFamily: "Karla_700Bold", fontSize: 16, color: C.white },
  btnTextDark:  { fontFamily: "Karla_700Bold", fontSize: 16, color: C.text },

  // ── Confidence bottom sheet ──
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.35)",
  },
  sheet: {
    position: "absolute", bottom: 0, left: 0, right: 0,
    backgroundColor: C.white,
    borderTopLeftRadius: 24, borderTopRightRadius: 24,
    paddingHorizontal: 20, paddingBottom: 40, paddingTop: 12,
  },
  dragHandle: {
    width: 36, height: 4, borderRadius: 2,
    backgroundColor: C.border,
    alignSelf: "center", marginBottom: 20,
  },
  sheetTitle: {
    fontFamily: "Karla_700Bold", fontSize: 20, color: C.text, textAlign: "center",
  },
  sheetSub: {
    fontFamily: "Karla_400Regular", fontSize: 14, color: C.muted,
    textAlign: "center", marginTop: 6, marginBottom: 24,
  },
  confRow: { flexDirection: "row", gap: 10, marginBottom: 24 },
  confCard: {
    flex: 1, backgroundColor: C.pageBg,
    borderRadius: 16, borderWidth: 1.5, borderColor: C.border,
    alignItems: "center", paddingVertical: 16, paddingHorizontal: 6, gap: 6,
  },
  confCardActive: {
    borderColor: C.primary,
    backgroundColor: "rgba(34,101,255,0.05)",
  },
  confEmoji:      { fontSize: 32, lineHeight: 38 },
  confLabel:      { fontFamily: "Karla_700Bold", fontSize: 13, color: C.text, textAlign: "center", lineHeight: 17 },
  confLabelActive:{ color: C.primary },
  confDesc:       { fontFamily: "Karla_400Regular", fontSize: 11, color: C.muted, textAlign: "center", lineHeight: 15 },
  confDescActive: { color: C.primary },
});
