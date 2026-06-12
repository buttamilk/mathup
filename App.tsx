import React from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { useFonts } from "@expo-google-fonts/karla";
import {
  Karla_700Bold,
  Karla_400Regular,
  Karla_500Medium,
} from "@expo-google-fonts/karla";
import { Caveat_700Bold } from "@expo-google-fonts/caveat";
import {
  DMSans_400Regular,
  DMSans_500Medium,
  DMSans_700Bold,
} from "@expo-google-fonts/dm-sans";
import { View, ActivityIndicator } from "react-native";
import SplashScreen from "./src/screens/SplashScreen";
import HomeScreen, { BottomTabBar, TabName } from "./src/screens/HomeScreen";
import SearchScreen from "./src/screens/SearchScreen";
import TopicDetailScreen from "./src/screens/TopicDetailScreen";
import TaskDetailScreen from "./src/screens/TaskDetailScreen";
import ExerciseSummaryScreen from "./src/screens/ExerciseSummaryScreen";
import SuperskillsScreen, { SUPERSKILLS } from "./src/screens/SuperskillsScreen";
import SuperskillDetailScreen from "./src/screens/SuperskillDetailScreen";
import SuperskillArticleScreen from "./src/screens/SuperskillArticleScreen";
import type { Superskill } from "./src/screens/SuperskillsScreen";
import type { Task } from "./src/screens/TopicDetailScreen";

type AppScreen = "splash" | "main";

interface TopicRoute {
  number: number;
  title: string;
  dot: "relevant" | "important" | "helpful";
}

const TOPIC_ROUTES: Record<number, TopicRoute> = {
  1: { number: 1, title: "Exponential function & Logarithm", dot: "relevant" },
  2: { number: 2, title: "Data & Probability",               dot: "important" },
  3: { number: 3, title: "Geometry & Shapes",                dot: "helpful" },
};

export default function App() {
  const [fontsLoaded] = useFonts({
    Karla_700Bold,
    Karla_400Regular,
    Karla_500Medium,
    Caveat_700Bold,
    DMSans_400Regular,
    DMSans_500Medium,
    DMSans_700Bold,
  });

  const [appScreen, setAppScreen] = React.useState<AppScreen>("splash");
  const [activeTab, setActiveTab] = React.useState<TabName>("Home");
  const [activeTopic, setActiveTopic] = React.useState<number | null>(null);
  const [activeSkill, setActiveSkill] = React.useState<Superskill | null>(null);
  const [articleSkill, setArticleSkill] = React.useState<Superskill | null>(null);
  const [activeTask, setActiveTask] = React.useState<Task | null>(null);
  const [showSummary, setShowSummary] = React.useState(false);

  if (!fontsLoaded) {
    return (
      <View style={{ flex: 1, backgroundColor: "#FFFFFF", alignItems: "center", justifyContent: "center" }}>
        <ActivityIndicator color="#2265FF" />
      </View>
    );
  }

  const tabBar = (
    <BottomTabBar
      activeTab={activeTab}
      onTabPress={(tab) => setActiveTab(tab)}
    />
  );

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      {appScreen === "splash" ? (
        <SplashScreen
          onNewUser={() => setAppScreen("main")}
          onReturningUser={() => setAppScreen("main")}
        />
      ) : showSummary && activeTask !== null ? (
        <ExerciseSummaryScreen
          task={activeTask}
          onClose={() => { setShowSummary(false); setActiveTask(null); }}
          onKeepPractising={() => { setShowSummary(false); }}
        />
      ) : activeTask !== null ? (
        <TaskDetailScreen
          task={activeTask}
          onClose={() => setActiveTask(null)}
          onComplete={() => setShowSummary(true)}
          bottomTabBar={null}
        />
      ) : articleSkill !== null ? (
        <SuperskillArticleScreen
          skill={articleSkill}
          onClose={() => { setArticleSkill(null); setActiveSkill(null); }}
          onBackToIntro={() => { setActiveSkill(articleSkill); setArticleSkill(null); }}
          bottomTabBar={null}
        />
      ) : activeSkill !== null ? (
        <SuperskillDetailScreen
          skill={activeSkill}
          onClose={() => setActiveSkill(null)}
          onLetsGo={() => { setArticleSkill(activeSkill); setActiveSkill(null); }}
          bottomTabBar={null}
        />
      ) : activeTopic !== null && TOPIC_ROUTES[activeTopic] ? (
        <TopicDetailScreen
          {...TOPIC_ROUTES[activeTopic]}
          onBack={() => setActiveTopic(null)}
          onTaskPress={(task) => setActiveTask(task)}
          bottomTabBar={null}
        />
      ) : activeTab === "Search" ? (
        <SearchScreen bottomTabBar={tabBar} />
      ) : activeTab === "Superskills" ? (
        <SuperskillsScreen
          onSkillPress={(skill) => setActiveSkill(skill)}
          bottomTabBar={tabBar}
        />
      ) : (
        <HomeScreen
          activeTab={activeTab}
          onTabPress={setActiveTab}
          onTopicPress={(n) => setActiveTopic(n)}
          onSkillPress={(id) => setActiveSkill(SUPERSKILLS.find((s) => s.id === id) ?? null)}
          onAllSkills={() => setActiveTab("Superskills")}
        />
      )}
    </GestureHandlerRootView>
  );
}
