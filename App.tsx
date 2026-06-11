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

type AppScreen = "splash" | "main";

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
      ) : activeTab === "Search" ? (
        <SearchScreen bottomTabBar={tabBar} />
      ) : (
        <HomeScreen activeTab={activeTab} onTabPress={setActiveTab} />
      )}
    </GestureHandlerRootView>
  );
}
