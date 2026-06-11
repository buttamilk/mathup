import React, { useRef, useState, useCallback, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  StatusBar,
  Platform,
  SafeAreaView,
  Modal,
  Animated,
  Easing,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { C, T, tagShadow, activePillStyle } from "../theme";
import { MATH_TOPICS, POPULAR, GAP_TOPICS, MathTopic } from "../data/mathTopics";

const haptic = () => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

// ─── Highlight matching substring in blue ─────────────────────────────────────
function HighlightedText({ text, query }: { text: string; query: string }) {
  if (!query) return <Text style={s.resultTitle}>{text}</Text>;
  const idx = text.toLowerCase().indexOf(query.toLowerCase());
  if (idx === -1) return <Text style={s.resultTitle}>{text}</Text>;
  return (
    <Text style={s.resultTitle}>
      {text.slice(0, idx)}
      <Text style={s.resultTitleMatch}>{text.slice(idx, idx + query.length)}</Text>
      {text.slice(idx + query.length)}
    </Text>
  );
}

// ─── Static chip (popular / gap) ──────────────────────────────────────────────
function SearchChip({ topic, active = false, onPress }: {
  topic: MathTopic; active?: boolean; onPress: (t: MathTopic) => void;
}) {
  return (
    <TouchableOpacity
      style={[s.chip, tagShadow, active && activePillStyle]}
      activeOpacity={0.8}
      onPressIn={haptic}
      onPress={() => onPress(topic)}
    >
      <View style={[s.typeIcon, active && { borderColor: C.white }]}>
        <Ionicons
          name={topic.type === "video" ? "play" : "book-outline"}
          size={13}
          color={active ? C.white : C.text}
        />
      </View>
      <Text style={[T.body14, { color: active ? C.white : C.text }]} numberOfLines={1}>
        {topic.title}
      </Text>
    </TouchableOpacity>
  );
}

// ─── Single search result row ─────────────────────────────────────────────────
function ResultRow({ topic, query, onPress }: {
  topic: MathTopic; query: string; onPress: (t: MathTopic) => void;
}) {
  return (
    <TouchableOpacity
      style={s.resultRow}
      activeOpacity={0.7}
      onPressIn={haptic}
      onPress={() => onPress(topic)}
    >
      <View style={s.typeIcon}>
        <Ionicons name={topic.type === "video" ? "play" : "book-outline"} size={13} color={C.muted} />
      </View>
      <View style={s.resultTextCol}>
        <HighlightedText text={topic.title} query={query} />
        <Text style={s.resultCategory}>{topic.category}</Text>
      </View>
      <Ionicons name="arrow-forward" size={16} color={C.muted} />
    </TouchableOpacity>
  );
}

// ─── Pulsing ring component ───────────────────────────────────────────────────
function PulseRing({ delay, size }: { delay: number; size: number }) {
  const scale   = useRef(new Animated.Value(1)).current;
  const opacity = useRef(new Animated.Value(0.5)).current;

  useEffect(() => {
    const t = setTimeout(() => {
      Animated.loop(
        Animated.parallel([
          Animated.timing(scale,   { toValue: 2.4, duration: 1600, easing: Easing.out(Easing.cubic), useNativeDriver: true }),
          Animated.timing(opacity, { toValue: 0,   duration: 1600, easing: Easing.out(Easing.cubic), useNativeDriver: true }),
        ])
      ).start();
    }, delay);
    return () => clearTimeout(t);
  }, []);

  return (
    <Animated.View
      pointerEvents="none"
      style={{
        position: "absolute",
        width: size, height: size,
        borderRadius: size / 2,
        backgroundColor: C.primary,
        opacity,
        transform: [{ scale }],
      }}
    />
  );
}

// ─── Voice overlay ────────────────────────────────────────────────────────────
function VoiceOverlay({ visible, onDismiss }: { visible: boolean; onDismiss: () => void }) {
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: visible ? 1 : 0,
      duration: 220,
      useNativeDriver: true,
    }).start();
  }, [visible]);

  if (!visible) return null;

  return (
    <Modal transparent animationType="none" visible={visible} onRequestClose={onDismiss}>
      <Animated.View style={[s.overlayBg, { opacity: fadeAnim }]}>
        <TouchableOpacity style={{ flex: 1 }} activeOpacity={1} onPress={onDismiss}>
          <View style={s.overlayCenter} pointerEvents="box-none">

            {/* Rings behind mic — all centred in the same space */}
            <View style={s.micWrap}>
              <PulseRing delay={0}   size={80} />
              <PulseRing delay={400} size={80} />
              <PulseRing delay={800} size={80} />
              {/* Mic button on top */}
              <View style={s.micCircle}>
                <Ionicons name="mic" size={32} color={C.white} />
              </View>
            </View>

            {/* Labels */}
            <Text style={s.listeningLabel}>Listening…</Text>
            <Text style={s.listeningHint}>Tap anywhere to dismiss</Text>

          </View>
        </TouchableOpacity>
      </Animated.View>
    </Modal>
  );
}

// ─── Main screen ──────────────────────────────────────────────────────────────
interface Props {
  bottomTabBar: React.ReactNode;
}

export default function SearchScreen({ bottomTabBar }: Props) {
  const [query, setQuery] = useState("");
  const [voiceOpen, setVoiceOpen] = useState(false);
  const inputRef = useRef<TextInput>(null);

  const results = query.trim().length > 0
    ? MATH_TOPICS.filter((t) =>
        t.title.toLowerCase().includes(query.toLowerCase()) ||
        t.category.toLowerCase().includes(query.toLowerCase())
      )
    : [];

  const handleChipPress = useCallback((topic: MathTopic) => {
    haptic();
    setQuery(topic.title);
    inputRef.current?.focus();
  }, []);

  const handleMic = () => {
    haptic();
    setVoiceOpen(true);
  };

  const dismissVoice = () => {
    setVoiceOpen(false);
    // After overlay closes, focus input so iOS keyboard dictation is ready
    setTimeout(() => inputRef.current?.focus(), 260);
  };

  const clearQuery = () => {
    setQuery("");
    inputRef.current?.focus();
  };

  return (
    <View style={{ flex: 1, backgroundColor: C.pageBg }}>
      <StatusBar barStyle="dark-content" />
      <SafeAreaView style={{ flex: 1 }} edges={["top"] as any}>

        {/* Search bar */}
        <View style={s.searchBarWrap}>
          <View style={[s.searchBar, tagShadow]}>
            <Ionicons name="search-outline" size={18} color={C.muted} style={{ marginRight: 8 }} />
            <TextInput
              ref={inputRef}
              style={s.searchInput}
              placeholder="Search any topic…"
              placeholderTextColor={C.muted}
              value={query}
              onChangeText={setQuery}
              returnKeyType="search"
              autoCorrect={false}
              autoCapitalize="none"
            />
            {query.length > 0 ? (
              <TouchableOpacity onPress={clearQuery} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
                <Ionicons name="close-circle" size={18} color={C.muted} />
              </TouchableOpacity>
            ) : (
              <TouchableOpacity onPress={handleMic} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
                <Ionicons name="mic-outline" size={20} color={C.primary} />
              </TouchableOpacity>
            )}
          </View>
        </View>

        <ScrollView
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 32 }}
        >
          {query.trim().length === 0 ? (
            /* ── Default state: popular + gaps ── */
            <>
              <View style={s.section}>
                <Text style={s.sectionLabel}>Popular searches:</Text>
                <View style={s.chipWrap}>
                  {POPULAR.map((t) => (
                    <SearchChip key={t.id} topic={t} active={query === t.title} onPress={handleChipPress} />
                  ))}
                </View>
              </View>

              <View style={s.section}>
                <Text style={s.sectionLabel}>Common knowledge gaps:</Text>
                <View style={s.chipWrap}>
                  {GAP_TOPICS.map((t) => (
                    <SearchChip key={t.id} topic={t} active={query === t.title} onPress={handleChipPress} />
                  ))}
                </View>
              </View>
            </>
          ) : results.length > 0 ? (
            /* ── Live results ── */
            <View style={s.section}>
              <Text style={s.sectionLabel}>{results.length} result{results.length !== 1 ? "s" : ""}</Text>
              <View style={s.resultList}>
                {results.map((topic) => (
                  <ResultRow
                    key={topic.id}
                    topic={topic}
                    query={query}
                    onPress={handleChipPress}
                  />
                ))}
              </View>
            </View>
          ) : (
            /* ── No results ── */
            <View style={s.emptyState}>
              <Ionicons name="search-outline" size={40} color={C.border} />
              <Text style={[T.body16b, { color: C.muted, marginTop: 12 }]}>No topics found</Text>
              <Text style={[T.body14, { color: C.muted, marginTop: 4, textAlign: "center" }]}>
                Try a different keyword or browse from the home screen
              </Text>
            </View>
          )}
        </ScrollView>
      </SafeAreaView>

      <VoiceOverlay visible={voiceOpen} onDismiss={dismissVoice} />
      {bottomTabBar}
    </View>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────
const s = StyleSheet.create({
  searchBarWrap: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 16,
  },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: C.white,
    borderRadius: 28,
    paddingHorizontal: 16,
    height: 52,
    borderWidth: 1,
    borderColor: C.border,
  },
  searchInput: {
    flex: 1,
    fontFamily: "Karla_400Regular",
    fontSize: 16,
    color: C.text,
    paddingVertical: 0,
  },

  section: {
    paddingHorizontal: 16,
    marginTop: 40,
  },
  sectionLabel: {
    fontFamily: "Karla_400Regular",
    fontSize: 14,
    color: C.muted,
    marginBottom: 12,
  },

  // Chips — wrap layout
  chipWrap: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  chip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: C.white,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: C.border,
  },
  typeIcon: {
    width: 26,
    height: 26,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: C.muted,
    alignItems: "center",
    justifyContent: "center",
  },

  // Result rows
  resultList: {
    borderRadius: 16,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: C.border,
    backgroundColor: C.white,
  },
  resultRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: C.border,
  },
  resultTextCol: {
    flex: 1,
    gap: 2,
  },
  resultTitle: {
    fontFamily: "Karla_400Regular",
    fontSize: 15,
    color: C.text,
    lineHeight: 20,
  },
  resultTitleMatch: {
    fontFamily: "Karla_700Bold",
    color: C.primary,
  },
  resultCategory: {
    fontFamily: "Karla_400Regular",
    fontSize: 12,
    color: C.muted,
  },

  // Empty state
  emptyState: {
    marginTop: 80,
    alignItems: "center",
    paddingHorizontal: 40,
  },

  // Voice overlay
  overlayBg: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.80)",
  },
  overlayCenter: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  micWrap: {
    width: 80, height: 80,
    alignItems: "center",
    justifyContent: "center",
  },
  micCircle: {
    position: "absolute",
    width: 80, height: 80,
    borderRadius: 40,
    backgroundColor: C.primary,
    alignItems: "center",
    justifyContent: "center",
  },
  listeningLabel: {
    fontFamily: "Karla_700Bold",
    fontSize: 20,
    color: "#FFFFFF",
    marginTop: 28,
    letterSpacing: 0.2,
  },
  listeningHint: {
    fontFamily: "Karla_400Regular",
    fontSize: 13,
    color: "rgba(255,255,255,0.5)",
    marginTop: 8,
  },
});
