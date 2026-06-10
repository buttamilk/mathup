import "./global.css";
import React from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import {
  useFonts,
  SpaceGrotesk_700Bold,
  SpaceGrotesk_500Medium,
} from "@expo-google-fonts/space-grotesk";
import { Caveat_700Bold } from "@expo-google-fonts/caveat";
import {
  DMSans_400Regular,
  DMSans_500Medium,
  DMSans_700Bold,
} from "@expo-google-fonts/dm-sans";
import { View, ActivityIndicator } from "react-native";
import SplashScreen from "./src/screens/SplashScreen";

export default function App() {
  const [fontsLoaded] = useFonts({
    SpaceGrotesk_700Bold,
    SpaceGrotesk_500Medium,
    Caveat_700Bold,
    DMSans_400Regular,
    DMSans_500Medium,
    DMSans_700Bold,
  });

  if (!fontsLoaded) {
    return (
      <View style={{ flex: 1, backgroundColor: "#0D0D2B", alignItems: "center", justifyContent: "center" }}>
        <ActivityIndicator color="#6C63FF" />
      </View>
    );
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SplashScreen
        onNewUser={() => console.log("New user flow")}
        onReturningUser={() => console.log("Returning user flow")}
      />
    </GestureHandlerRootView>
  );
}
