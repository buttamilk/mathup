import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  Image,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { C, T, cardShadow, tagShadow, activePillStyle } from "../theme";

const haptic = () => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

// ─── Data ─────────────────────────────────────────────────────────────────────
export type Difficulty = "easy" | "medium" | "hard" | "master";

// null = not attempted; "cold"=struggling 🥶, "mid"=progressing 😌, "master"=mastered 🤓
export type CircleState = null | "cold" | "mid" | "master";

export interface Task {
  id: string;
  title: string;
  difficulty: Difficulty;
  duration: number;   // minutes
  relevance: number;  // percent
  circles: [CircleState, CircleState, CircleState];
}

const DIFFICULTY_EMOJI: Record<Difficulty, string> = {
  easy:   "✌️",
  medium: "🌶️",
  hard:   "🌶️🌶️",
  master: "🌶️🌶️🌶️",
};


const TASKS: Task[] = [
  { id: "t1", title: "Build functions (Exponential function)",        difficulty: "easy",   duration: 8,  relevance: 87, circles: [null, "mid",    null    ] },
  { id: "t2", title: "Interpret graph (Power function)",              difficulty: "easy",   duration: 10, relevance: 87, circles: ["cold", null,  null    ] },
  { id: "t3", title: "Solve equations (Exponential function)",        difficulty: "medium", duration: 12, relevance: 24, circles: [null,  null,   "master"] },
  { id: "t4", title: "Mental math (Logarithm)",                       difficulty: "medium", duration: 13, relevance: 82, circles: [null,  null,   "master"] },
  { id: "t5", title: "Calculate compound interest (Exp. function)",   difficulty: "hard",   duration: 15, relevance: 87, circles: [null,  null,   null    ] },
  { id: "t6", title: "Calculate investment time (Exp. function)",     difficulty: "hard",   duration: 17, relevance: 87, circles: [null,  null,   null    ] },
  { id: "t7", title: "Compare growth rates (Exponential function)",   difficulty: "master", duration: 20, relevance: 87, circles: [null,  null,   null    ] },
];

const SKILLS = [
  { id: "s1", label: "Introduction",               type: "article" as const },
  { id: "s2", label: "X-intercepts",               type: "video"   as const },
  { id: "s3", label: "Pie chart",                  type: "article" as const },
  { id: "s4", label: "Local minimum",              type: "article" as const },
  { id: "s5", label: "Rearranging terms: factoring out", type: "video" as const },
];

const FILTERS: { key: Difficulty | "all"; label: string; emoji: string }[] = [
  { key: "easy",   label: "Easy",   emoji: "✌️"         },
  { key: "medium", label: "Medium", emoji: "🌶️"        },
  { key: "hard",   label: "Hard",   emoji: "🌶️🌶️"    },
  { key: "master", label: "Master", emoji: "🌶️🌶️🌶️" },
];

const dotRelevantAsset = require("../../assets/cards/dot-relevant.png");
const interestDeco     = require("../../assets/cards/interest-deco1a.png");
const trophyAsset      = require("../../assets/cards/trophy.png");

// ─── Completion circles ────────────────────────────────────────────────────────
const CIRCLE_EMOJI: Record<NonNullable<CircleState>, string> = {
  cold:   "🥶",
  mid:    "😌",
  master: "🤓",
};

function CompletionCircles({ circles }: { circles: [CircleState, CircleState, CircleState] }) {
  return (
    <View style={s.circles}>
      {circles.map((state, i) => (
        <View key={i} style={[s.circle, !state && s.circleEmpty]}>
          {state && (
            <Text style={s.circleEmoji}>{CIRCLE_EMOJI[state]}</Text>
          )}
        </View>
      ))}
    </View>
  );
}

// ─── Skill chip ───────────────────────────────────────────────────────────────
function SkillChip({ label, type, onPress }: {
  label: string; type: "article" | "video"; onPress: () => void;
}) {
  const [pressed, setPressed] = React.useState(false);
  return (
    <TouchableOpacity
      style={[s.skillChip, tagShadow, pressed && activePillStyle]}
      activeOpacity={1}
      onPress={onPress}
      onPressIn={() => { haptic(); setPressed(true); }}
      onPressOut={() => setPressed(false)}
    >
      <View style={[s.skillChipIcon, pressed && { borderColor: C.white }]}>
        <Ionicons
          name={type === "video" ? "play" : "book-outline"}
          size={12}
          color={pressed ? C.white : C.muted}
        />
      </View>
      <Text style={[T.body14, { color: pressed ? C.white : C.text }]} numberOfLines={1}>
        {label}
      </Text>
    </TouchableOpacity>
  );
}

// ─── Task row ─────────────────────────────────────────────────────────────────
function TaskRow({ task, onPress }: { task: Task; onPress: () => void }) {
  return (
    <TouchableOpacity style={s.taskRow} activeOpacity={0.8} onPressIn={haptic} onPress={onPress}>
      <View style={s.taskMain}>
        {/* Difficulty emoji + title */}
        <View style={s.taskTitleRow}>
          <Text style={s.taskEmoji}>{DIFFICULTY_EMOJI[task.difficulty]}</Text>
          <Text style={[T.body14b, { flex: 1, lineHeight: 20 }]}>{task.title}</Text>
        </View>
        {/* Meta: time + relevance */}
        <View style={s.taskMeta}>
          <Ionicons name="time-outline" size={13} color={C.muted} />
          <Text style={[T.body14, { color: C.muted, marginRight: 12 }]}>{task.duration}min</Text>
          <Ionicons name="document-outline" size={13} color={C.muted} />
          <Text style={[T.body14, { color: C.muted }]}>{task.relevance}% relevant</Text>
        </View>
      </View>
      <CompletionCircles circles={task.circles} />
    </TouchableOpacity>
  );
}

// ─── Screen ───────────────────────────────────────────────────────────────────
interface Props {
  number: number;
  title: string;
  dot: "relevant" | "important" | "helpful";
  onBack: () => void;
  onTaskPress: (task: Task) => void;
  bottomTabBar: React.ReactNode;
}

export default function TopicDetailScreen({ number, title, dot, onBack, onTaskPress, bottomTabBar }: Props) {
  const [activeFilter, setActiveFilter] = useState<Difficulty | "all">("all");

  const filteredTasks = activeFilter === "all"
    ? TASKS
    : TASKS.filter((t) => t.difficulty === activeFilter);

  const dotLabel: Record<string, string> = {
    relevant:  "very relevant",
    important: "important",
    helpful:   "helpful",
  };

  return (
    <View style={{ flex: 1, backgroundColor: C.pageBg }}>
      <StatusBar barStyle="dark-content" />
      <SafeAreaView style={{ flex: 1 }} edges={["top"] as any}>

        {/* ── Nav bar ── */}
        <View style={s.navBar}>
          <TouchableOpacity style={s.closeBtn} onPress={() => { haptic(); onBack(); }} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
            <Ionicons name="close" size={20} color={C.text} />
          </TouchableOpacity>
          <View style={s.relevanceTag}>
            <Text style={[T.body14, { color: C.muted }]}>{dotLabel[dot]}</Text>
            <Image source={dotRelevantAsset} style={{ width: 9, height: 9 }} resizeMode="contain" />
          </View>
        </View>

        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 32 }}>

          {/* ── Title ── */}
          <View style={s.titleBlock}>
            <Text style={T.h2}>{number}. {title}</Text>
          </View>

          {/* ── Test your knowledge banner ── */}
          <View style={s.px}>
            <View style={[s.knowledgeBanner, cardShadow]}>
              <View style={s.knowledgeText}>
                <Text style={[T.body16b, { color: C.white, marginBottom: 4 }]}>Test your knowledge</Text>
                <Text style={[T.body14,  { color: "rgba(255,255,255,0.85)" }]}>Where do you currently stand?</Text>
              </View>
              <Image source={interestDeco} style={s.bannerDeco} resizeMode="contain" />
            </View>
          </View>

          {/* ── Math skills ── */}
          <View style={s.section}>
            <Text style={T.h16}>Math skills:</Text>
            <View style={s.chipWrap}>
              {SKILLS.map((skill) => (
                <SkillChip
                  key={skill.id}
                  label={skill.label}
                  type={skill.type}
                  onPress={() => haptic()}
                />
              ))}
            </View>
          </View>

          {/* ── Tasks ── */}
          <View style={s.section}>
            <Text style={T.h16}>Tasks:</Text>

            {/* Difficulty filter — paddingVertical gives shadows room to breathe */}
            <ScrollView horizontal showsHorizontalScrollIndicator={false}
              contentContainerStyle={s.filterRow}
              style={{ overflow: "visible" }}>
              {FILTERS.map((f) => {
                const isActive = activeFilter === f.key;
                return (
                  <TouchableOpacity
                    key={f.key}
                    style={[s.filterChip, tagShadow, isActive && activePillStyle]}
                    activeOpacity={0.8}
                    onPressIn={haptic}
                    onPress={() => setActiveFilter(isActive ? "all" : f.key)}
                  >
                    <Text style={s.filterEmoji}>{f.emoji}</Text>
                    <Text style={[T.body14b, { color: isActive ? C.white : C.text }]}>{f.label}</Text>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>

            {/* Task list card */}
            <View style={[s.taskList, cardShadow]}>
              {filteredTasks.map((task, i) => (
                <View key={task.id}>
                  <TaskRow task={task} onPress={() => onTaskPress(task)} />
                  {i < filteredTasks.length - 1 && <View style={s.taskDivider} />}
                </View>
              ))}
            </View>
          </View>

          {/* ── Exam challenge ── */}
          <View style={s.px}>
            <TouchableOpacity style={[s.examChallenge, cardShadow]} activeOpacity={0.8} onPressIn={haptic}>
              <View style={s.examLeft}>
                <Image source={trophyAsset} style={{ width: 22, height: 22 }} resizeMode="contain" />
                <Text style={[T.body16b, { color: C.primary, marginLeft: 8 }]}>Exam challenge</Text>
              </View>
              <CompletionCircles circles={[null, null, null]} />
            </TouchableOpacity>
          </View>

        </ScrollView>
      </SafeAreaView>
      {bottomTabBar}
    </View>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────
const s = StyleSheet.create({
  px: { paddingHorizontal: 16 },

  navBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
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
  relevanceTag: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },

  titleBlock: {
    paddingHorizontal: 16,
    paddingTop: 4,
    paddingBottom: 20,
  },

  // Knowledge banner
  knowledgeBanner: {
    backgroundColor: C.primary,
    borderRadius: 24,
    padding: 20,
    flexDirection: "row",
    alignItems: "center",
    overflow: "hidden",
    minHeight: 88,
  },
  knowledgeText: { flex: 1 },
  bannerDeco: {
    position: "absolute",
    right: -8,
    top: -10,
    width: 130,
    height: 90,
    opacity: 0.5,
  },

  section: {
    paddingHorizontal: 16,
    marginTop: 28,
    gap: 14,
  },

  // Skills chips
  chipWrap: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  skillChip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 7,
    backgroundColor: C.white,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: C.border,
  },
  skillChipIcon: {
    width: 22, height: 22,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: C.muted,
    alignItems: "center",
    justifyContent: "center",
  },

  // Difficulty filter
  filterRow: {
    gap: 10,
    paddingRight: 16,
    paddingVertical: 4,   // room for shadow below and above chips
  },
  filterChip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: C.white,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: C.border,
  },
  filterEmoji: { fontSize: 14 },

  // Task list
  taskList: {
    backgroundColor: C.white,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: C.border,
    overflow: "hidden",
  },
  taskRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 14,
    gap: 12,
  },
  taskMain: { flex: 1, gap: 6 },
  taskTitleRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 6,
  },
  taskEmoji: { fontSize: 15, lineHeight: 20 },
  taskMeta: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  taskDivider: {
    height: 1,
    backgroundColor: C.border,
    marginHorizontal: 16,
  },

  // Completion circles
  circles: {
    flexDirection: "row",
    gap: 6,
  },
  circle: {
    width: 28, height: 28,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: C.border,
    backgroundColor: "#F9F9F9",
    alignItems: "center",
    justifyContent: "center",
  },
  // Not-yet-attempted circles: keep shape, fade to 35% so they read as "empty"
  circleEmpty: {
    opacity: 0.35,
  },
  circleEmoji: {
    fontSize: 16,
    lineHeight: 20,
  },

  // Exam challenge
  examChallenge: {
    backgroundColor: C.white,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: C.border,
    paddingHorizontal: 16,
    paddingVertical: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 28,
  },
  examLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
});
