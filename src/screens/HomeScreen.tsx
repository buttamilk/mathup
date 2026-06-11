import React, { useRef, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  SafeAreaView,
  StatusBar,
  Platform,
  Image,
  Animated,
  Easing,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { C, T, cardShadow, tagShadow, activeCardStyle, activePillStyle } from "../theme";

const haptic = () => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

const { width } = Dimensions.get("window");

// Days until exam
const EXAM_DATE = new Date("2026-09-15");
const daysUntilExam = Math.ceil(
  (EXAM_DATE.getTime() - Date.now()) / (1000 * 60 * 60 * 24)
);
const PROGRESS = 0.21;

function getGreeting() {
  const h = new Date().getHours();
  if (h < 12) return "Good morning ☀️";
  if (h < 18) return "Good afternoon 👋";
  return "Good evening 🌙";
}

// ─── Assets ────────────────────────────────────────────────────────────────────
const assets = {
  goalsDecoration: require("../../assets/Home/3.png"),
  topicIcon1:  require("../../assets/cards/icon-topic1.png"),
  topicIcon2:  require("../../assets/cards/icon-topic2.png"),
  topicIcon3:  require("../../assets/cards/icon-topic3.png"),
  topicBg1:    require("../../assets/cards/bg-topic1.png"),
  topicBg2:    require("../../assets/cards/bg-topic2.png"),
  topicBg3:    require("../../assets/cards/bg-topic3.png"),
  dotRelevant: require("../../assets/cards/dot-relevant.png"),
  dotImportant:require("../../assets/cards/dot-important.png"),
  dotHelpful:  require("../../assets/cards/dot-helpful.png"),
  // Interest card decorations — exact Figma assets
  interestDeco1a: require("../../assets/cards/interest-deco1a.png"),
  interestDeco1b: require("../../assets/cards/interest-deco1b.png"),
  interestDeco2:  require("../../assets/cards/interest-deco2.png"),
  interestDeco3:  require("../../assets/cards/interest-deco3.png"),
  circleBlue:   require("../../assets/cards/circle-blue.png"),
  circleYellow: require("../../assets/cards/circle-yellow.png"),
  circleOrange: require("../../assets/cards/circle-orange.png"),
  practiceTrophy: require("../../assets/cards/trophy.png"),
  skillStress: require("../../assets/Home/Card/skill-stress.png"),
  skillPizza:  require("../../assets/Home/Card/pizza.png"),
  skillFace:   require("../../assets/face1.png"),
  blackCircle: require("../../assets/Home/UI/EN_Home/black circle image.png"),
};

// ─── Section header ────────────────────────────────────────────────────────────
function SectionHeader({ title, onAll }: { title: string; onAll?: () => void }) {
  return (
    <View style={s.sectionRow}>
      <Text style={T.h16}>{title}</Text>
      {onAll && (
        <TouchableOpacity onPress={onAll} activeOpacity={0.6} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
          <Text style={[T.body14, { color: C.primary }]}>all ›</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

// ─── Timer option button with press-in scale animation ─────────────────────────
function TimerOptionBtn({ opt, isSelected, onPress }: {
  opt: { label: string; minutes: number };
  isSelected: boolean;
  onPress: () => void;
}) {
  const scale = useRef(new Animated.Value(1)).current;
  const onPressIn  = () => { haptic(); Animated.spring(scale, { toValue: 1.22, useNativeDriver: true, tension: 120, friction: 3 }).start(); };
  const onPressOut = () => Animated.spring(scale, { toValue: 1, useNativeDriver: true, tension: 100, friction: 3 }).start();

  return (
    <Animated.View style={{ transform: [{ scale }] }}>
      <TouchableOpacity
        style={[s.timerOptionBtn, isSelected && s.timerOptionBtnSelected]}
        onPress={onPress}
        onPressIn={onPressIn}
        onPressOut={onPressOut}
        activeOpacity={1}
      >
        {opt.minutes !== -1 ? (
          <>
            <Image source={stopwatchIcon} style={{ width: 22, height: 22, tintColor: C.white }} resizeMode="contain" />
            <Text style={[s.timerOptionLabel, { marginTop: 4 }]}>{opt.label}</Text>
          </>
        ) : (
          <Text style={[s.timerOptionLabel, { fontSize: 20, letterSpacing: 2 }]}>···</Text>
        )}
      </TouchableOpacity>
    </Animated.View>
  );
}

// ─── Timer options ─────────────────────────────────────────────────────────────
const TIMER_OPTIONS = [
  { label: "10m", minutes: 10 },
  { label: "20m", minutes: 20 },
  { label: "30m", minutes: 30 },
  { label: "···", minutes: -1 },
];
const TIMER_ROW_HEIGHT = 96; // enough for 56pt button + label

// ─── Header ────────────────────────────────────────────────────────────────────
function Header({ name }: { name: string }) {
  const [timerOpen, setTimerOpen] = React.useState(false);
  const [selectedMinutes, setSelectedMinutes] = React.useState<number | null>(null);
  // remainingSeconds drives the live countdown; null = no timer running
  const [remainingSeconds, setRemainingSeconds] = React.useState<number | null>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Height-only animation — useNativeDriver MUST be false for layout props.
  const heightAnim = useRef(new Animated.Value(0)).current;

  // Start/restart the countdown whenever a new duration is chosen
  React.useEffect(() => {
    if (selectedMinutes != null && selectedMinutes > 0) {
      if (intervalRef.current) clearInterval(intervalRef.current);
      setRemainingSeconds(selectedMinutes * 60);
      intervalRef.current = setInterval(() => {
        setRemainingSeconds((s) => {
          if (s == null || s <= 1) {
            clearInterval(intervalRef.current!);
            intervalRef.current = null;
            return 0;
          }
          return s - 1;
        });
      }, 1000);
    }
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [selectedMinutes]);

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60).toString().padStart(2, "0");
    const s = (secs % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  };

  const openTimer = () => {
    setTimerOpen(true);
    Animated.spring(heightAnim, { toValue: TIMER_ROW_HEIGHT, useNativeDriver: false, tension: 70, friction: 12 }).start();
  };

  const closeTimer = () => {
    Animated.spring(heightAnim, { toValue: 0, useNativeDriver: false, tension: 70, friction: 12 }).start(() => setTimerOpen(false));
  };

  const selectTimer = (minutes: number) => {
    setSelectedMinutes(minutes === -1 ? 0 : minutes);
    // Close immediately so the pill appears at once, accordion animates away in background
    setTimerOpen(false);
    Animated.spring(heightAnim, { toValue: 0, useNativeDriver: false, tension: 70, friction: 12 }).start();
  };

  const dismissTimer = () => {
    if (intervalRef.current) { clearInterval(intervalRef.current); intervalRef.current = null; }
    setRemainingSeconds(null);
    setSelectedMinutes(null);
  };

  return (
    <View style={s.header}>

      {/* ── Accordion timer row ──
            Plain View clips overflow; Animated.View drives height only (JS driver). ── */}
      <View style={s.timerRowClip}>
        <Animated.View style={[s.timerRowInner, { height: heightAnim }]}>
          {TIMER_OPTIONS.map((opt) => (
            <TimerOptionBtn
              key={opt.label}
              opt={opt}
              isSelected={selectedMinutes === opt.minutes}
              onPress={() => selectTimer(opt.minutes)}
            />
          ))}

          {/* Close — white circle with blue border */}
          <TouchableOpacity style={s.timerCloseBtn} onPress={() => { haptic(); closeTimer(); }} activeOpacity={0.8}>
            <Ionicons name="close" size={20} color={C.primary} />
          </TouchableOpacity>
        </Animated.View>
      </View>

      {/* ── Greeting + clock button ── */}
      <View style={s.headerTop}>
        <View>
          <Text style={[T.body14, { color: C.muted, marginBottom: 8 }]}>{getGreeting()}</Text>
          <Text style={T.h2}>{name}</Text>
        </View>

        {!timerOpen && (
          remainingSeconds != null && remainingSeconds > 0 ? (
            /* ── Live countdown pill: tap time = reopen picker, tap × = dismiss ── */
            <View style={s.countdownPillBtn}>
              <TouchableOpacity style={s.countdownPillTime} onPress={() => { haptic(); openTimer(); }} activeOpacity={0.7}>
                <View style={s.countdownPillGroup}>
                  <Image source={stopwatchIcon} style={{ width: 15, height: 15, tintColor: C.primary }} resizeMode="contain" />
                  <Text style={[T.body14b, { color: C.primary, fontSize: 14 }]}>{formatTime(remainingSeconds)}</Text>
                </View>
              </TouchableOpacity>
              <TouchableOpacity style={s.countdownPillClose} onPress={() => { haptic(); dismissTimer(); }} activeOpacity={0.7} hitSlop={{ top: 8, bottom: 8, left: 4, right: 8 }}>
                <Ionicons name="close" size={14} color={C.muted} />
              </TouchableOpacity>
            </View>
          ) : (
            /* ── Plain clock button ── */
            <TouchableOpacity style={[s.clockBtn, tagShadow]} onPress={() => { haptic(); openTimer(); }} activeOpacity={0.7}>
              <Image source={stopwatchIcon} style={{ width: 22, height: 22, tintColor: C.primary }} resizeMode="contain" />
            </TouchableOpacity>
          )
        )}
      </View>

      {/* ── Stats row ── */}
      <View style={s.statsRow}>
        <View style={[s.countdownPill, tagShadow]}>
          <Text style={T.body14b}>📅 {daysUntilExam} days to go</Text>
        </View>
        <View style={s.progressGroup}>
          <View style={s.progressTrack}>
            <View style={[s.progressFill, { width: `${PROGRESS * 100}%` as any }]} />
          </View>
          <Text style={[T.body14b, { color: C.primary, minWidth: 30 }]}>
            {Math.round(PROGRESS * 100)}%
          </Text>
        </View>
      </View>
    </View>
  );
}

// ─── Goals card ────────────────────────────────────────────────────────────────
function GoalsCard() {
  return (
    // Shadow wrapper — no overflow:hidden so shadow renders on all sides
    <View style={[s.goalsCardShadow, cardShadow]}>
      <TouchableOpacity style={s.goalsCard} activeOpacity={0.85} onPressIn={haptic}>
        <View style={{ flex: 1 }}>
          <Text style={[T.body16b, { color: C.white, marginBottom: 4 }]}>Your goals</Text>
          <Text style={[T.body16, { color: "rgba(255,255,255,0.85)" }]}>
            We want to get to know you
          </Text>
        </View>
        <Image source={assets.goalsDecoration} style={s.goalsDecoration} resizeMode="contain" />
      </TouchableOpacity>
    </View>
  );
}

// ─── Topic card ────────────────────────────────────────────────────────────────
type DotType = "relevant" | "important" | "helpful";
const dotAsset: Record<DotType, any> = {
  relevant:  assets.dotRelevant,
  important: assets.dotImportant,
  helpful:   assets.dotHelpful,
};
const dotLabel: Record<DotType, string> = {
  relevant:  "very relevant",
  important: "important",
  helpful:   "helpful",
};

function TopicCard({
  icon, bgImage, number, title, dot, onPress,
}: {
  icon: any; bgImage: any; number: number; title: string; dot: DotType;
  onPress?: () => void;
}) {
  return (
    <View style={[s.topicCardShadow, cardShadow]}>
      <TouchableOpacity style={s.topicCard} activeOpacity={0.8} onPressIn={haptic} onPress={onPress}>
        <View style={s.topicImageArea}>
          <Image source={bgImage} style={s.topicBg} resizeMode="cover" />
          <Image source={icon} style={s.topicIcon} resizeMode="contain" />
        </View>
        <View style={s.topicTitleArea}>
          <Text style={[T.body16b, { textAlign: "center", lineHeight: 22, color: C.text }]} numberOfLines={3}>
            {number}. {title}
          </Text>
        </View>
        <View style={s.dotRow}>
          <Image source={dotAsset[dot]} style={{ width: 9, height: 9 }} resizeMode="contain" />
          <Text style={[T.body14, { color: C.muted }]}>{dotLabel[dot]}</Text>
        </View>
      </TouchableOpacity>
    </View>
  );
}

// ─── Basics chip ───────────────────────────────────────────────────────────────
function BasicChip({ label, selected = false, onPress }: {
  label: string; selected?: boolean; onPress?: () => void;
}) {
  const [pressed, setPressed] = React.useState(false);
  const active = selected || pressed;
  return (
    <TouchableOpacity
      style={[s.chip, tagShadow, active && activePillStyle]}
      activeOpacity={1}
      onPress={onPress}
      onPressIn={() => { haptic(); setPressed(true); }}
      onPressOut={() => setPressed(false)}
    >
      <Text style={[T.body14, active && { color: C.white }]}>{label}</Text>
    </TouchableOpacity>
  );
}

// ─── Practice test card ────────────────────────────────────────────────────────
function PracticeCard({ title, circle }: { title: string; circle: any }) {
  return (
    <View style={[s.practiceCardShadow, cardShadow]}>
      <TouchableOpacity style={s.practiceCard} activeOpacity={0.8} onPressIn={haptic}>
        <View style={s.practiceImageArea}>
          <Image source={circle} style={s.practiceCircle} resizeMode="contain" />
          <Image source={assets.practiceTrophy} style={s.practiceTrophy} resizeMode="contain" />
        </View>
        <Text style={[T.body16, { textAlign: "center", lineHeight: 20, marginTop: 16 }]}>{title}</Text>
      </TouchableOpacity>
    </View>
  );
}

// ─── Interest card ─────────────────────────────────────────────────────────────
function InterestCard({ title, decos }: {
  title: string;
  decos: { source: any; style: object }[];
}) {
  return (
    <View style={[s.interestCardShadow, cardShadow]}>
      <TouchableOpacity style={s.interestCard} activeOpacity={0.85} onPressIn={haptic}>
        <View style={s.interestText}>
          <Text style={[T.body16b, { color: C.white }]}>{title}</Text>
          <Text style={[T.body16, { color: "rgba(255,255,255,0.80)", marginTop: 2 }]}>Solve tasks</Text>
        </View>
        {decos.map((d, i) => (
          <Image key={i} source={d.source} style={[s.interestDeco, d.style]} resizeMode="contain" />
        ))}
      </TouchableOpacity>
    </View>
  );
}

// ─── Super skill card ──────────────────────────────────────────────────────────
function SuperSkillCard({ duration, title, illustration, imageStyle }: {
  duration: string; title: string; illustration: any; imageStyle?: object;
}) {
  return (
    <View style={[s.skillCardShadow, cardShadow]}>
      <TouchableOpacity style={s.skillCard} activeOpacity={0.8} onPressIn={haptic}>
        <View style={s.skillContent}>
          <Text style={[T.body14, { color: C.muted, textAlign: "center", marginBottom: 6 }]}>{duration}</Text>
          <Text style={[T.body16b, { textAlign: "center", lineHeight: 22 }]}>{title}</Text>
        </View>
        <View style={s.skillIllustrationContainer}>
          <Image source={illustration} style={[s.skillIllustration, imageStyle]} resizeMode="cover" />
        </View>
      </TouchableOpacity>
    </View>
  );
}

// ─── Bottom tab bar (4 tabs — exact Figma spec) ───────────────────────────────
type TabItem = {
  label: string;
  icon: keyof typeof Ionicons.glyphMap;
  iconActive: keyof typeof Ionicons.glyphMap;
  active: boolean;
};

const TABS: TabItem[] = [
  { label: "Home",       icon: "home-outline",  iconActive: "home",         active: true  },
  { label: "Superskills",icon: "flash-outline", iconActive: "flash",        active: false },
  { label: "Search",     icon: "search-outline",iconActive: "search",       active: false },
  { label: "Me",         icon: "person-outline",iconActive: "person",       active: false },
];

const homeIcon = require("../../assets/Home/Home&Furniture/house-happy.png");
const stopwatchIcon = require("../../assets/Home/UI/stopwatch.png");

export type TabName = "Home" | "Superskills" | "Search" | "Me";

interface BottomTabBarProps {
  activeTab?: TabName;
  onTabPress?: (tab: TabName) => void;
}

export function BottomTabBar({ activeTab = "Home", onTabPress }: BottomTabBarProps) {
  const bottomInset = Platform.OS === "ios" ? 34 : 0;
  return (
    <View style={[s.tabBar, { paddingBottom: bottomInset }]}>
      <View style={s.tabRow}>
        {TABS.map((tab) => {
          const isActive = tab.label === activeTab;
          return (
            <TouchableOpacity
              key={tab.label}
              style={s.tabItem}
              activeOpacity={0.7}
              onPress={() => { haptic(); onTabPress?.(tab.label as TabName); }}
            >
              {tab.label === "Home" ? (
                <Image
                  source={homeIcon}
                  style={{ width: 24, height: 24, tintColor: isActive ? C.primary : "#3D3D3D" }}
                  resizeMode="contain"
                />
              ) : (
                <Ionicons
                  name={isActive ? tab.iconActive : tab.icon}
                  size={24}
                  color={isActive ? C.primary : "#3D3D3D"}
                />
              )}
              <Text style={[s.tabLabel, { color: isActive ? C.primary : "#3D3D3D" }]}>
                {tab.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

// ─── Screen ────────────────────────────────────────────────────────────────────
interface HomeScreenProps {
  activeTab?: TabName;
  onTabPress?: (tab: TabName) => void;
}

export default function HomeScreen({ activeTab = "Home", onTabPress }: HomeScreenProps) {
  return (
    <View style={{ flex: 1, backgroundColor: C.pageBg }}>
      <StatusBar barStyle="dark-content" />
      {/* SafeAreaView only handles top inset — tab bar owns its own bottom inset */}
      <SafeAreaView style={{ flex: 1 }} edges={["top"] as any}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 24 }}
        >
          <Header name="Jamal" />

          {/* Let's get started */}
          <View style={s.section}>
            <SectionHeader title="Let's get started:" />
<GoalsCard />
          </View>

          {/* Tasks by topic */}
          <View style={s.section}>
            <SectionHeader title="Tasks by topic:" onAll={() => {}} />
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={s.hScrollContent}
              style={s.hScroll}
            >
              <TopicCard icon={assets.topicIcon1} bgImage={assets.topicBg1} number={1}
                title={"Quadratic functions\n& equations"} dot="relevant" />
              <TopicCard icon={assets.topicIcon2} bgImage={assets.topicBg2} number={2}
                title={"Data &\nprobability"} dot="important" />
              <TopicCard icon={assets.topicIcon3} bgImage={assets.topicBg3} number={3}
                title={"Geometry\n& shapes"} dot="helpful" />
            </ScrollView>
          </View>

          {/* Refresh basics */}
          <View style={s.section}>
            <SectionHeader title="Suggested topics to refresh:" onAll={() => {}} />
            <View style={s.chipGrid}>
              {["Basics", "Point of origin", "Pie chart", "Geometry Shapes",
                "Probability Trees", "Compound interest", "Tangents", "Correlation analysis"
              ].map(label => <BasicChip key={label} label={label} />)}
            </View>
          </View>

          {/* Practice tests */}
          <View style={s.section}>
            <SectionHeader title="Practice tests:" onAll={() => {}} />
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={s.hScrollContent}
              style={s.hScroll}
            >
              <PracticeCard title={"2023 – Math\nfinal exam"} circle={assets.circleYellow} />
              <PracticeCard title={"2022 – Math\nfinal exam"} circle={assets.circleBlue} />
              <PracticeCard title={"2021 – Math\nfinal exam"} circle={assets.circleOrange} />
            </ScrollView>
          </View>

          {/* For your interests — off-white framed section */}
          <View style={s.interestFrame}>
            {/* Black circle decoration — top left, partially overlapping edge */}
            <Image source={assets.blackCircle} style={s.interestFrameCircle} resizeMode="contain" />

            {/* Header */}
            <SectionHeader title="For your interests:" onAll={() => {}} />

            {/* Cards */}
            <InterestCard title="Sustainable investing" decos={[
              { source: assets.interestDeco1a, style: { right: -8,  top: -10, width: 120, height: 80 } },
              { source: assets.interestDeco1b, style: { right: 60,  bottom: -8, width: 50, height: 60 } },
            ]} />
            <View style={{ height: 12 }} />
            <InterestCard title="Climate change" decos={[
              { source: assets.interestDeco2, style: { right: 8, top: 0, width: 110, height: 88 } },
            ]} />
            <View style={{ height: 12 }} />
            <InterestCard title="Politics & society" decos={[
              { source: assets.interestDeco3, style: { right: 10, top: 4,  width: 80, height: 50 } },
              { source: assets.interestDeco3, style: { right: 48, bottom: 4, width: 60, height: 40, opacity: 0.6 } },
            ]} />

            {/* Footer CTA */}
            <Text style={[T.body14, { color: C.muted, textAlign: "center", marginTop: 20 }]}>
              Develop new interests with us?
            </Text>
            <TouchableOpacity style={s.suggestBtn} onPressIn={haptic} activeOpacity={0.8}>
              <Text style={[T.body14b, { color: C.primary }]}>Suggest interests</Text>
            </TouchableOpacity>
          </View>

          {/* Learn super skills */}
          <View style={s.section}>
            <SectionHeader title="Learn super skills:" onAll={() => {}} />
            {/* Stress: render taller than container, shift up to reveal bottom (person + bike) */}
            <SuperSkillCard duration="5 min"
              title="Introduction to dealing with stress"
              illustration={assets.skillStress}
              imageStyle={{ height: 277, marginTop: -77 }} />
            <View style={{ height: 16 }} />
            {/* Pizza: fill container height exactly, no gap */}
            <SuperSkillCard duration="5 min"
              title="4 easy-peasy learning methods to try out"
              illustration={assets.skillPizza}
              imageStyle={{ height: 200 }} />

          </View>
        </ScrollView>
      </SafeAreaView>

      {/* Outside SafeAreaView — sits flush at the true bottom of the screen */}
      <BottomTabBar activeTab={activeTab} onTabPress={onTabPress} />
    </View>
  );
}

// ─── Styles ────────────────────────────────────────────────────────────────────
const s = StyleSheet.create({
  section:    { paddingHorizontal: 16, marginTop: 28 },
  sectionRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 16 },

  // Horizontal scroll — padding gives the card shadow room on all sides
  hScroll: { marginHorizontal: -16, marginBottom: -8 },
  hScrollContent: {
    paddingHorizontal: 16,  // restore section indent so first card aligns
    paddingBottom: 10,      // shadow bleeds down without clipping
    paddingTop: 4,          // shadow bleeds up
    gap: 12,
  },

  // Header
  header: {
    paddingHorizontal: 16,
    paddingTop: 20,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: C.border,
  },
  headerTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 20,
  },
  clockBtn: {
    width: 48, height: 48, borderRadius: 24,
    borderWidth: 2, borderColor: C.primary,
    alignItems: "center", justifyContent: "center",
    backgroundColor: C.white,
  },
  countdownPillBtn: {
    height: 40, borderRadius: 20,
    width: 116,
    flexDirection: "row",
    alignItems: "stretch",        // children fill full height for correct border divider
    backgroundColor: C.white,
    borderWidth: 1.5, borderColor: C.border,
    overflow: "hidden",
  },
  countdownPillTime: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  countdownPillGroup: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  countdownPillClose: {
    width: 36,
    alignItems: "center",
    justifyContent: "center",
    borderLeftWidth: 1,
    borderLeftColor: C.border,
  },
  // ── Timer accordion row ──────────────────────────
  timerRowClip: {
    overflow: "hidden",           // plain View owns the clip — no animation on this node
  },
  timerRowInner: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 4,
    height: TIMER_ROW_HEIGHT,
  },
  timerOptionBtn: {
    width: 56, height: 56, borderRadius: 28,
    backgroundColor: C.primary,
    alignItems: "center", justifyContent: "center",
    shadowColor: C.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 5,
    flexDirection: "column",
  },
  timerOptionBtnSelected: {
    backgroundColor: "#1A50D4",
    transform: [{ scale: 1.08 }],
  },
  timerOptionLabel: {
    fontFamily: "Karla_700Bold",
    fontSize: 11,
    color: C.white,
  },
  timerCloseBtn: {
    width: 56, height: 56, borderRadius: 28,
    borderWidth: 2, borderColor: C.primary,
    backgroundColor: C.white,
    alignItems: "center", justifyContent: "center",
  },
  statsRow: { flexDirection: "row", alignItems: "center", gap: 10 },
  countdownPill: {
    backgroundColor: C.white,
    borderRadius: 40,
    paddingHorizontal: 12, paddingVertical: 7,
    borderWidth: 1, borderColor: C.border,
  },
  progressGroup: { flex: 1, flexDirection: "row", alignItems: "center", gap: 8 },
  progressTrack: {
    flex: 1, height: 6, backgroundColor: C.border,
    borderRadius: 3, overflow: "hidden",
  },
  progressFill: { height: 6, backgroundColor: C.primary, borderRadius: 3 },

  // Goals card
  goalsCardShadow: { borderRadius: 24 },
  goalsCard: {
    backgroundColor: C.primary, borderRadius: 24,
    paddingLeft: 20, paddingVertical: 20,
    flexDirection: "row", alignItems: "center",
    overflow: "hidden",           // clips decoration image — shadow is on wrapper
  },
  goalsDecoration: {
    width: 88, height: 67,
    position: "absolute", right: -4, bottom: -10,
  },

  // Topic card
  topicCardShadow: { borderRadius: 24, width: 192 },
  topicCard: {
    width: 192, backgroundColor: C.white,
    borderRadius: 24, padding: 16,
    borderWidth: 1, borderColor: C.border,
    overflow: "hidden",
  },
  topicImageArea: {
    width: "100%", height: 112,
    alignItems: "center", justifyContent: "center",
  },
  topicBg: {
    position: "absolute", width: 80, height: 80,
    borderRadius: 40, opacity: 0.8,
  },
  topicIcon: { width: 52, height: 52 },
  // Fixed-height centred title block — dot always at same Y across all cards
  topicTitleArea: {
    height: 72,          // 3 lines × 22px lineHeight + breathing room
    marginTop: 16,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 4,
  },
  // Centred dot + text — no border, no background, no shadow
  dotRow: {
    flexDirection: "row", alignItems: "center", gap: 6,
    marginTop: 16,
    justifyContent: "center",
  },

  // Basics chips
  chipGrid: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  chip: {
    flexDirection: "row", alignItems: "center", gap: 6,
    backgroundColor: C.white, borderRadius: 12,
    paddingHorizontal: 12, paddingVertical: 9,
    borderWidth: 1, borderColor: C.border,
  },

  // Practice card
  practiceCardShadow: { borderRadius: 24, width: 160 },
  practiceCard: {
    width: 160, backgroundColor: C.white,
    borderRadius: 24, paddingHorizontal: 16, paddingVertical: 20,
    alignItems: "center",
    borderWidth: 1, borderColor: C.border,
    overflow: "hidden",
  },
  practiceImageArea: {
    width: 92, height: 92,
    alignItems: "center", justifyContent: "center",
  },
  practiceCircle: {
    position: "absolute", width: 92, height: 92,
  },
  practiceTrophy: {
    width: 40, height: 40,
  },

  // Interest card — Figma: #D95494, 24px radius, 88pt tall, overflow hidden clips decos
  interestCardShadow: { borderRadius: 24 },
  interestCard: {
    backgroundColor: C.pink,
    borderRadius: 24,
    height: 88,
    paddingHorizontal: 20,
    overflow: "hidden",
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: C.border,
  },
  interestText: {
    flex: 1,
    paddingRight: 100, // keeps text from overlapping decorations
  },
  interestDeco: {
    position: "absolute",
  },
  // Interest frame — off-white container wrapping the whole interests section
  interestFrame: {
    marginTop: 28,
    marginHorizontal: 16,
    backgroundColor: C.offWhite,
    borderRadius: 28,
    paddingHorizontal: 16,
    paddingTop: 20,
    paddingBottom: 24,
  },
  interestFrameCircle: {
    width: 39,
    height: 39,
    marginBottom: 16,
  },

  suggestBtn: {
    marginTop: 12,
    alignSelf: "center",
    borderWidth: 2,
    borderColor: C.primary,
    borderRadius: 40,
    paddingHorizontal: 28,
    paddingVertical: 12,
    backgroundColor: C.white,
  },

  // Skill card — full width, text top-centre, illustration bleeds to bottom edge
  skillCardShadow: { borderRadius: 24 },
  skillCard: {
    backgroundColor: C.white,
    borderRadius: 24,
    overflow: "hidden",
    borderWidth: 1, borderColor: C.border,
  },
  skillContent: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 16,
    alignItems: "center",
  },
  // Container clips the shifted image so no overflow shows outside the card
  skillIllustrationContainer: {
    height: 200,
    width: "100%",
    overflow: "hidden",
  },
  // Base: fills container width; imageStyle per card controls height + vertical position
  skillIllustration: {
    width: "100%",
    height: 200,
  },

  // Tab bar — flush at bottom, frosted glass, 24px top radius
  tabBar: {
    backgroundColor: "rgba(255,255,255,0.96)",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    // Single upward shadow — no borderTopWidth so there's no double line
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.07,
    shadowRadius: 8,
    elevation: 12,
  },
  tabRow: {
    flexDirection: "row",
    paddingTop: 12,
  },
  tabItem: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 4,
    paddingVertical: 4,
  },
  tabLabel: {
    fontFamily: "Karla_700Bold",
    fontSize: 12,
    lineHeight: 16,
  },
});
