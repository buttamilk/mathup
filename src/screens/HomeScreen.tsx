import React from "react";
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
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

const { width } = Dimensions.get("window");

// ─── Design tokens (from Figma component library) ─────────────────────────────
const C = {
  text:       "#222222",
  muted:      "#5F5F5F",
  primary:    "#2265FF",
  border:     "#E2E2E2",
  shadow:     "#E1E1E1",
  cardBg:     "#FFFFFF",
  offWhite:   "#F4F3EB",
  pageBg:     "#FFFFFF",
  pink:       "#D95494",
  pink2:      "#C0407A",
  pink3:      "#A8316A",
  white:      "#FFFFFF",
};

// Typography — exact from Figma
const T = StyleSheet.create({
  h2:       { fontFamily: "Karla_700Bold", fontSize: 32, lineHeight: 32, letterSpacing: -1.6, color: C.text },
  h3:       { fontFamily: "Karla_700Bold", fontSize: 24, lineHeight: 32, color: C.text },
  h16:      { fontFamily: "Karla_700Bold", fontSize: 16, lineHeight: 24, color: C.text },
  body16b:  { fontFamily: "Karla_700Bold", fontSize: 16, lineHeight: 20, color: C.text },
  body16:   { fontFamily: "Karla_400Regular", fontSize: 16, lineHeight: 20, color: C.text },
  body14b:  { fontFamily: "Karla_700Bold", fontSize: 14, lineHeight: 22, color: C.text },
  body14:   { fontFamily: "Karla_400Regular", fontSize: 14, lineHeight: 18, color: C.text },
});

// "Drawn" shadow — solid colour, zero blur, hard offset following card shape
// Matches Figma spec: 0px 4px 0px #DADADA
const cardShadow = {
  shadowColor: "#CACACA",
  shadowOffset: { width: 0, height: 4 },
  shadowOpacity: 1,
  shadowRadius: 0,
  elevation: 3,
};

const tagShadow = {
  shadowColor: "#CACACA",
  shadowOffset: { width: 0, height: 3 },
  shadowOpacity: 1,
  shadowRadius: 0,
  elevation: 2,
};

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

// ─── Header ────────────────────────────────────────────────────────────────────
function Header({ name }: { name: string }) {
  return (
    <View style={s.header}>
      <View style={s.headerTop}>
        <View>
          <Text style={[T.body14, { color: C.muted, marginBottom: 8 }]}>{getGreeting()}</Text>
          <Text style={T.h2}>{name}</Text>
        </View>
        <TouchableOpacity style={[s.clockBtn, tagShadow]} activeOpacity={0.7}>
          <Ionicons name="stopwatch-outline" size={22} color={C.primary} />
        </TouchableOpacity>
      </View>
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
      <TouchableOpacity style={s.goalsCard} activeOpacity={0.85}>
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
  icon, bgImage, number, title, dot,
}: {
  icon: any; bgImage: any; number: number; title: string; dot: DotType;
}) {
  return (
    <View style={[s.topicCardShadow, cardShadow]}>
      <TouchableOpacity style={s.topicCard} activeOpacity={0.8}>
        {/* Fixed-height image area */}
        <View style={s.topicImageArea}>
          <Image source={bgImage} style={s.topicBg} resizeMode="cover" />
          <Image source={icon} style={s.topicIcon} resizeMode="contain" />
        </View>

        {/* Title area — fixed height, centred, so dot always lands at same Y */}
        <View style={s.topicTitleArea}>
          <Text style={[T.body16b, { textAlign: "center", lineHeight: 22, color: C.text }]} numberOfLines={3}>
            {number}. {title}
          </Text>
        </View>

        {/* Dot label — centred, plain dot + text, no box */}
        <View style={s.dotRow}>
          <Image source={dotAsset[dot]} style={{ width: 9, height: 9 }} resizeMode="contain" />
          <Text style={[T.body14, { color: C.muted }]}>{dotLabel[dot]}</Text>
        </View>
      </TouchableOpacity>
    </View>
  );
}

// ─── Basics chip ───────────────────────────────────────────────────────────────
function BasicChip({ label }: { label: string }) {
  return (
    <TouchableOpacity style={[s.chip, tagShadow]} activeOpacity={0.75}>
      <Text style={T.body14}>{label}</Text>
    </TouchableOpacity>
  );
}

// ─── Practice test card ────────────────────────────────────────────────────────
function PracticeCard({ title, circle }: { title: string; circle: any }) {
  return (
    <View style={[s.practiceCardShadow, cardShadow]}>
      <TouchableOpacity style={s.practiceCard} activeOpacity={0.8}>
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
type InterestDecoProps = { sources: any[]; positions: object[] };

function InterestCard({ title, decos }: {
  title: string;
  decos: { source: any; style: object }[];
}) {
  return (
    <View style={[s.interestCardShadow, cardShadow]}>
      <TouchableOpacity style={s.interestCard} activeOpacity={0.85}>
        {/* Text — left side */}
        <View style={s.interestText}>
          <Text style={[T.body16b, { color: C.white }]}>{title}</Text>
          <Text style={[T.body16, { color: "rgba(255,255,255,0.80)", marginTop: 2 }]}>Solve tasks</Text>
        </View>
        {/* Decorations — right side, absolutely positioned, clipped by card */}
        {decos.map((d, i) => (
          <Image key={i} source={d.source} style={[s.interestDeco, d.style]} resizeMode="contain" />
        ))}
      </TouchableOpacity>
    </View>
  );
}

// ─── Super skill card ──────────────────────────────────────────────────────────
function SuperSkillCard({ duration, title, emoji }: { duration: string; title: string; emoji: string }) {
  return (
    <View style={[s.skillCardShadow, cardShadow]}>
      <TouchableOpacity style={s.skillCard} activeOpacity={0.8}>
        <View style={s.skillImageArea}>
          <Text style={{ fontSize: 52 }}>{emoji}</Text>
        </View>
        <View style={s.skillContent}>
          <Text style={[T.body14, { color: C.muted, marginBottom: 4 }]}>{duration}</Text>
          <Text style={T.body16b}>{title}</Text>
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

function BottomTabBar() {
  // paddingBottom = safe area for home indicator (34pt on Face ID iPhones, 0 on Android)
  const bottomInset = Platform.OS === "ios" ? 34 : 0;
  return (
    <View style={[s.tabBar, { paddingBottom: bottomInset }]}>
      <View style={s.tabRow}>
        {TABS.map((tab) => (
          <TouchableOpacity key={tab.label} style={s.tabItem} activeOpacity={0.7}>
            <Ionicons
              name={tab.active ? tab.iconActive : tab.icon}
              size={24}
              color={tab.active ? C.primary : "#3D3D3D"}
            />
            <Text style={[s.tabLabel, { color: tab.active ? C.primary : "#3D3D3D" }]}>
              {tab.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

// ─── Screen ────────────────────────────────────────────────────────────────────
export default function HomeScreen() {
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

          {/* For your interests */}
          <View style={s.section}>
            <SectionHeader title="For your interests:" onAll={() => {}} />
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
            <TouchableOpacity style={[s.suggestBtn, tagShadow]} activeOpacity={0.7}>
              <Text style={[T.body14, { color: C.muted }]}>Suggest interests</Text>
            </TouchableOpacity>
          </View>

          {/* Learn super skills */}
          <View style={s.section}>
            <SectionHeader title="Learn super skills:" onAll={() => {}} />
            <SuperSkillCard duration="5 min"
              title="Introduction to dealing with stress" emoji="🧘" />
            <View style={{ height: 12 }} />
            <SuperSkillCard duration="5 min"
              title="4 easy-peasy learning methods to try out" emoji="💡" />
          </View>
        </ScrollView>
      </SafeAreaView>

      {/* Outside SafeAreaView — sits flush at the true bottom of the screen */}
      <BottomTabBar />
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
  suggestBtn: {
    marginTop: 16, alignSelf: "center",
    borderWidth: 1, borderColor: C.border,
    borderRadius: 40, paddingHorizontal: 20, paddingVertical: 10,
    backgroundColor: C.white,
  },

  // Skill card
  skillCardShadow: { borderRadius: 24 },
  skillCard: {
    backgroundColor: C.offWhite, borderRadius: 24,
    overflow: "hidden",           // clips the image area — shadow is on wrapper
    borderWidth: 1, borderColor: C.border,
  },
  skillImageArea: {
    height: 130, backgroundColor: "#EDECEA",
    alignItems: "center", justifyContent: "center",
  },
  skillContent: { padding: 16 },

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
