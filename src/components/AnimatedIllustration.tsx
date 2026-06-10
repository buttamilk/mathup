import React, { useEffect, useRef } from "react";
import {
  View,
  Image,
  Animated,
  Easing,
  StyleSheet,
  Dimensions,
} from "react-native";

const { width } = Dimensions.get("window");

// Full illustration dimensions (original PNG)
const ORIG_W = 2196;
const ORIG_H = 1166;

// Rendered size on screen
const RENDERED_W = width * 1.05;
const RENDERED_H = (ORIG_H / ORIG_W) * RENDERED_W;
const SCALE = RENDERED_W / ORIG_W;

// Convert original pixel coords → rendered points
function px(val: number) {
  return val * SCALE;
}

const assets = {
  base: require("../../assets/illustration-starter.png"),
  charHead: require("../../assets/face1.png"),
  charHand: require("../../assets/hand.png"),
  dogFace: require("../../assets/dog face.png"),
  dogTail: require("../../assets/dog tail.png"),
};

// Rotate around a pivot point using translate trick
function rotatePivot(
  rotate: Animated.Value,
  pivotX: number,
  pivotY: number
): object[] {
  return [
    { translateX: pivotX },
    { translateY: pivotY },
    {
      rotate: rotate.interpolate({
        inputRange: [-1, 1],
        outputRange: ["-1deg", "1deg"],
      }),
    },
    { translateX: -pivotX },
    { translateY: -pivotY },
  ];
}

// Gentle nod loop — rocks between -maxDeg and +maxDeg
function useNod(maxDeg: number, duration: number, delay = 0) {
  const val = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(val, {
          toValue: maxDeg,
          duration,
          delay,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
        Animated.timing(val, {
          toValue: -maxDeg,
          duration,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
        Animated.timing(val, {
          toValue: 0,
          duration: duration * 0.5,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);
  return val;
}

// Slide loop — moves horizontally back and forth
function useSlide(maxPx: number, duration: number, delay = 0) {
  const val = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(val, {
          toValue: maxPx,
          duration,
          delay,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
        Animated.timing(val, {
          toValue: -maxPx * 0.5,
          duration,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
        Animated.timing(val, {
          toValue: 0,
          duration: duration * 0.4,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);
  return val;
}

export default function AnimatedIllustration() {
  // Animations
  const charHeadRot = useNod(6, 1600, 0);       // head nods
  const charHandSlide = useSlide(px(6), 900, 200); // finger slides over phone
  const dogFaceRot = useNod(8, 1200, 400);       // dog shakes head
  const dogTailRot = useNod(18, 500, 0);          // tail wags fast

  // Piece positions (original px → rendered points)
  // face1: pos=(1220,454) size=(61x57)
  const charHeadX = px(1220);
  const charHeadY = px(454);
  const charHeadW = px(61);
  const charHeadH = px(57);

  // hand: pos=(1118,630) size=(32x35)
  const charHandX = px(1118);
  const charHandY = px(630);
  const charHandW = px(32);
  const charHandH = px(35);

  // dog face: pos=(1987,736) size=(53x44)
  const dogFaceX = px(1987);
  const dogFaceY = px(736);
  const dogFaceW = px(53);
  const dogFaceH = px(44);

  // dog tail: pos=(1853,884) size=(14x34)
  const dogTailX = px(1853);
  const dogTailY = px(884);
  const dogTailW = px(14);
  const dogTailH = px(34);

  return (
    <View style={[styles.container, { width: RENDERED_W, height: RENDERED_H }]}>
      {/* Base illustration */}
      <Image
        source={assets.base}
        style={{ width: RENDERED_W, height: RENDERED_H }}
        resizeMode="stretch"
      />

      {/* Char head — nods around bottom-center (neck pivot) */}
      <Animated.Image
        source={assets.charHead}
        style={[
          styles.piece,
          {
            left: charHeadX,
            top: charHeadY,
            width: charHeadW,
            height: charHeadH,
          },
          {
            transform: rotatePivot(
              charHeadRot,
              charHeadW / 2,   // pivot x: center of head
              charHeadH         // pivot y: bottom of head (neck)
            ),
          },
        ]}
        resizeMode="contain"
      />

      {/* Char hand — slides horizontally (swiping phone) */}
      <Animated.Image
        source={assets.charHand}
        style={[
          styles.piece,
          {
            left: charHandX,
            top: charHandY,
            width: charHandW,
            height: charHandH,
          },
          {
            transform: [{ translateX: charHandSlide }],
          },
        ]}
        resizeMode="contain"
      />

      {/* Dog face — shakes around bottom-center (neck pivot) */}
      <Animated.Image
        source={assets.dogFace}
        style={[
          styles.piece,
          {
            left: dogFaceX,
            top: dogFaceY,
            width: dogFaceW,
            height: dogFaceH,
          },
          {
            transform: rotatePivot(
              dogFaceRot,
              dogFaceW / 2,
              dogFaceH
            ),
          },
        ]}
        resizeMode="contain"
      />

      {/* Dog tail — wags around top (base of tail) */}
      <Animated.Image
        source={assets.dogTail}
        style={[
          styles.piece,
          {
            left: dogTailX,
            top: dogTailY,
            width: dogTailW,
            height: dogTailH,
          },
          {
            transform: rotatePivot(
              dogTailRot,
              dogTailW / 2,
              0  // pivot at top
            ),
          },
        ]}
        resizeMode="contain"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "relative",
    overflow: "hidden",
    backgroundColor: "transparent",
  },
  piece: {
    position: "absolute",
  },
});
