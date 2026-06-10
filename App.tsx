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
import HomeScreen from "./src/screens/HomeScreen";

type Screen = "splash" | "home";

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

  const [screen, setScreen] = React.useState<Screen>("splash");

  if (!fontsLoaded) {
    return (
      <View style={{ flex: 1, backgroundColor: "#FFFFFF", alignItems: "center", justifyContent: "center" }}>
        <ActivityIndicator color="#2265FF" />
      </View>
    );
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      {screen === "splash" ? (
        <SplashScreen
          onNewUser={() => setScreen("home")}
          onReturningUser={() => setScreen("home")}
        />
      ) : (
        <HomeScreen />
      )}
    </GestureHandlerRootView>
  );
}
