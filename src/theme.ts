/**
 * MathUp design system — single source of truth.
 * Import C, T, cardShadow, tagShadow, and activeStyle into every screen.
 *
 * Active / selected state rule:
 *   - Momentary press  → activeOpacity (already on every TouchableOpacity)
 *   - Selected / on    → borderColor: C.primary + bg: C.activeBg
 *   - Always reserve the border slot (borderWidth: 2, transparent by default)
 *     so no layout shift occurs when the state changes.
 */

import { StyleSheet } from "react-native";

// ─── Colour tokens ────────────────────────────────────────────────────────────
export const C = {
  text:       "#222222",
  muted:      "#5F5F5F",
  primary:    "#2265FF",   // brand blue — buttons, links, progress
  primaryDark:"#1A50D4",   // active / selected state fill
  border:     "#E2E2E2",
  shadow:     "#CACACA",
  cardBg:     "#FFFFFF",
  offWhite:   "#F4F3EB",
  pageBg:     "#FFFFFF",
  pink:       "#D95494",
  white:      "#FFFFFF",
  activeBg:   "rgba(34,101,255,0.04)",  // very faint blue tint for selected cards
};

// ─── Typography ───────────────────────────────────────────────────────────────
export const T = StyleSheet.create({
  h2:      { fontFamily: "Karla_700Bold",    fontSize: 32, lineHeight: 32, letterSpacing: -1.6, color: C.text },
  h3:      { fontFamily: "Karla_700Bold",    fontSize: 24, lineHeight: 32, color: C.text },
  h16:     { fontFamily: "Karla_700Bold",    fontSize: 16, lineHeight: 24, color: C.text },
  body16b: { fontFamily: "Karla_700Bold",    fontSize: 16, lineHeight: 20, color: C.text },
  body16:  { fontFamily: "Karla_400Regular", fontSize: 16, lineHeight: 20, color: C.text },
  body14b: { fontFamily: "Karla_700Bold",    fontSize: 14, lineHeight: 22, color: C.text },
  body14:  { fontFamily: "Karla_400Regular", fontSize: 14, lineHeight: 18, color: C.text },
});

// ─── Shadows — "drawn" style: zero blur, hard offset, matches Figma ───────────
export const cardShadow = {
  shadowColor:  C.shadow,
  shadowOffset: { width: 0, height: 4 },
  shadowOpacity: 1,
  shadowRadius: 0,
  elevation: 3,
} as const;

export const tagShadow = {
  shadowColor:  C.shadow,
  shadowOffset: { width: 0, height: 3 },
  shadowOpacity: 1,
  shadowRadius: 0,
  elevation: 2,
} as const;

// ─── Active / selected state helpers ─────────────────────────────────────────
/**
 * Merge into the inner TouchableOpacity style when a card is selected.
 * Always pair with `borderWidth: 2, borderColor: "transparent"` on the
 * default style so no layout shift happens on state change.
 */
export const activeCardStyle = {
  borderWidth:  2,
  borderColor:  C.primary,
  backgroundColor: C.activeBg,
} as const;

/**
 * For pill / chip buttons (e.g. topic tags, suggest buttons).
 * Selected → filled primary background + white text.
 */
export const activePillStyle = {
  backgroundColor: C.primary,
  borderColor: C.primary,
} as const;

// ─── Spacing scale (use these constants everywhere) ──────────────────────────
export const SPACING = {
  xs:   4,
  sm:   8,
  md:  16,
  lg:  24,
  xl:  28,
  xxl: 40,
} as const;

// ─── Border radius scale ──────────────────────────────────────────────────────
export const RADIUS = {
  sm:  12,
  md:  16,
  lg:  20,
  xl:  24,
  pill:40,
} as const;
