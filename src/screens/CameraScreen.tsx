import React, { useRef, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  StatusBar,
} from "react-native";
import { CameraView, useCameraPermissions } from "expo-camera";
import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { C } from "../theme";

const haptic = () => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

interface Props {
  onCapture: (uri: string) => void;
  onClose: () => void;
}

export default function CameraScreen({ onCapture, onClose }: Props) {
  const cameraRef = useRef<CameraView>(null);
  const [permission, requestPermission] = useCameraPermissions();
  const [capturing, setCapturing] = useState(false);

  if (!permission) return <View style={s.screen} />;

  if (!permission.granted) {
    return (
      <View style={[s.screen, s.permissionBox]}>
        <StatusBar barStyle="light-content" />
        <Ionicons name="camera-outline" size={48} color={C.white} style={{ marginBottom: 16 }} />
        <Text style={s.permissionText}>Camera access is needed{"\n"}to check your answer.</Text>
        <TouchableOpacity style={s.permissionBtn} onPress={requestPermission}>
          <Text style={s.permissionBtnText}>Allow Camera</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={onClose} style={{ marginTop: 16 }}>
          <Text style={[s.permissionText, { opacity: 0.6 }]}>Cancel</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const shoot = async () => {
    if (!cameraRef.current || capturing) return;
    haptic();
    setCapturing(true);
    try {
      const photo = await cameraRef.current.takePictureAsync({ quality: 0.7 });
      if (photo?.uri) onCapture(photo.uri);
    } catch {
      setCapturing(false);
    }
  };

  return (
    <View style={s.screen}>
      <StatusBar barStyle="light-content" />
      <CameraView ref={cameraRef} style={s.camera} facing="back">

        {/* X button */}
        <SafeAreaView style={s.overlay} edges={["top"] as any}>
          <TouchableOpacity style={s.closeBtn} onPress={() => { haptic(); onClose(); }}>
            <Ionicons name="close" size={22} color={C.white} />
          </TouchableOpacity>

          {/* Scanning frame */}
          <View style={s.frameWrap}>
            <View style={s.frame}>
              {/* Corner accents */}
              <View style={[s.corner, s.cornerTL]} />
              <View style={[s.corner, s.cornerTR]} />
              <View style={[s.corner, s.cornerBL]} />
              <View style={[s.corner, s.cornerBR]} />
            </View>
          </View>

          {/* Shutter + instruction */}
          <View style={s.bottom}>
            <Text style={s.instruction}>
              Hold your camera over your working{"\n"}and take a photo
            </Text>
            <TouchableOpacity
              style={[s.shutter, capturing && { opacity: 0.6 }]}
              onPress={shoot}
              activeOpacity={0.8}
            >
              <View style={s.shutterInner} />
            </TouchableOpacity>
          </View>
        </SafeAreaView>

      </CameraView>
    </View>
  );
}

const FRAME_W = 300;
const FRAME_H = 380;
const CORNER  = 24;
const THICK   = 3;

const s = StyleSheet.create({
  screen:  { flex: 1, backgroundColor: "#000" },
  camera:  { flex: 1 },
  overlay: { flex: 1 },

  // Close button
  closeBtn: {
    margin: 16,
    width: 40, height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(0,0,0,0.45)",
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "flex-start",
  },

  // Scanning frame centered
  frameWrap: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  frame: {
    width: FRAME_W,
    height: FRAME_H,
  },
  corner: {
    position: "absolute",
    width: CORNER, height: CORNER,
    borderColor: C.white,
  },
  cornerTL: { top: 0,          left: 0,          borderTopWidth: THICK, borderLeftWidth: THICK,  borderTopLeftRadius: 6 },
  cornerTR: { top: 0,          right: 0,         borderTopWidth: THICK, borderRightWidth: THICK, borderTopRightRadius: 6 },
  cornerBL: { bottom: 0,       left: 0,          borderBottomWidth: THICK, borderLeftWidth: THICK,  borderBottomLeftRadius: 6 },
  cornerBR: { bottom: 0,       right: 0,         borderBottomWidth: THICK, borderRightWidth: THICK, borderBottomRightRadius: 6 },

  // Bottom area
  bottom: {
    alignItems: "center",
    paddingBottom: 48,
    gap: 24,
  },
  instruction: {
    fontFamily: "Karla_400Regular",
    fontSize: 15,
    lineHeight: 22,
    color: C.white,
    textAlign: "center",
    opacity: 0.9,
  },
  shutter: {
    width: 72, height: 72,
    borderRadius: 36,
    borderWidth: 3,
    borderColor: C.white,
    alignItems: "center",
    justifyContent: "center",
  },
  shutterInner: {
    width: 56, height: 56,
    borderRadius: 28,
    backgroundColor: C.white,
  },

  // Permission screen
  permissionBox: {
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 32,
  },
  permissionText: {
    fontFamily: "Karla_400Regular",
    fontSize: 16,
    lineHeight: 24,
    color: C.white,
    textAlign: "center",
    marginBottom: 8,
  },
  permissionBtn: {
    marginTop: 8,
    paddingHorizontal: 28,
    paddingVertical: 14,
    borderRadius: 16,
    backgroundColor: C.primary,
  },
  permissionBtnText: {
    fontFamily: "Karla_700Bold",
    fontSize: 16,
    color: C.white,
  },
});
