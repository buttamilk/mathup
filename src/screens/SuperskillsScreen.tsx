import React from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  Image,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { C, T, cardShadow } from "../theme";
import { SuperSkillCard } from "./HomeScreen";

const haptic = () => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

// ─── Assets ───────────────────────────────────────────────────────────────────
const imgStress    = require("../../assets/Home/Card/skill-stress.png");
const imgPizza     = require("../../assets/Home/Card/pizza.png");
const imgSleep     = require("../../assets/cards/sleeping child.png");
const circleYellow = require("../../assets/cards/circle-yellow.png");
const circleBlue   = require("../../assets/cards/circle-blue.png");

// ─── Data ─────────────────────────────────────────────────────────────────────
export interface Superskill {
  id: string;
  duration: string;
  title: string;
  image: any;
  imageStyle?: object;
  dark?: boolean;
}

export const SUPERSKILLS: Superskill[] = [
  {
    id: "stress",
    duration: "5 min",
    title: "Little intro to stress management",
    image: imgStress,
    imageStyle: { height: 277, marginTop: -77 },
  },
  {
    id: "learning",
    duration: "5 min",
    title: "4 easy-peasy learning methods to try",
    image: imgPizza,
    imageStyle: { height: 200 },
  },
  {
    id: "sleep",
    duration: "5 min",
    title: "Why sleeping more might improve your grades",
    image: imgSleep,
    imageStyle: { height: 240, marginTop: -40 },
    dark: true,
  },
];

// ─── Stats item ───────────────────────────────────────────────────────────────
function StatItem({ blobImage, icon, value, label }: {
  blobImage: any;
  icon: keyof typeof Ionicons.glyphMap;
  value: string;
  label: string;
}) {
  return (
    <View style={s.statItem}>
      <View style={s.statIconWrap}>
        <Image source={blobImage} style={s.statBlob} resizeMode="contain" />
        <Ionicons name={icon} size={32} color={C.text} />
      </View>
      <Text style={[T.body16b, { marginTop: 6 }]}>{value}</Text>
      <Text style={[T.body14, { color: C.muted, marginTop: 2 }]}>{label}</Text>
    </View>
  );
}

// ─── Screen ───────────────────────────────────────────────────────────────────
interface Props {
  onSkillPress: (skill: Superskill) => void;
  bottomTabBar: React.ReactNode;
}

export default function SuperskillsScreen({ onSkillPress, bottomTabBar }: Props) {
  return (
    <View style={{ flex: 1, backgroundColor: C.pageBg }}>
      <StatusBar barStyle="dark-content" />
      <SafeAreaView style={{ flex: 1 }} edges={["top"] as any}>
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={s.scroll}>

          {/* ── Headline — same top padding as HomeScreen header area ── */}
          <Text style={[T.h2, s.headline]}>Superskills</Text>

          {/* ── Stats ── */}
          <View style={s.statsRow}>
            <StatItem blobImage={circleYellow} icon="book-outline"  value="50" label="Mastery points"    />
            <View style={s.divider} />
            <StatItem blobImage={circleBlue}   icon="medal-outline" value="4"  label="Superskills gained" />
          </View>

          {/* ── Cards — reuse exact HomeScreen SuperSkillCard ── */}
          <View style={s.cards}>
            {SUPERSKILLS.map((skill, i) => (
              <View key={skill.id}>
                <SuperSkillCard
                  duration={skill.duration}
                  title={skill.title}
                  illustration={skill.image}
                  imageStyle={skill.imageStyle}
                  dark={skill.dark}
                  onPress={() => onSkillPress(skill)}
                />
                {i < SUPERSKILLS.length - 1 && <View style={{ height: 16 }} />}
              </View>
            ))}
          </View>

        </ScrollView>
      </SafeAreaView>
      {bottomTabBar}
    </View>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────
const s = StyleSheet.create({
  // Match HomeScreen: 24pt bottom padding consistent with other screens
  scroll: { paddingBottom: 32 },

  // Same left/right padding (16) and top gap as HomeScreen's first section
  headline: {
    paddingHorizontal: 16,
    paddingTop: 20,
    paddingBottom: 0,
  },

  // Stats sit 28pt below headline — same as section marginTop on HomeScreen
  statsRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    marginTop: 28,
    marginBottom: 0,
  },
  statItem: { flex: 1, alignItems: "center" },
  statIconWrap: {
    width: 92, height: 92,
    alignItems: "center",
    justifyContent: "center",
  },
  statBlob: { position: "absolute", width: 92, height: 92 },
  divider: {
    width: 1,
    height: 80,
    backgroundColor: C.border,
    marginHorizontal: 12,
  },

  // Cards sit 28pt below stats — same spacing as between sections on HomeScreen
  cards: {
    paddingHorizontal: 16,
    marginTop: 28,
  },
});
