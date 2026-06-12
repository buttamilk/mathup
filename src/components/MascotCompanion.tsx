"use client";

/**
 * MascotCompanion — animated study companion blob
 * Built with Framer Motion (web). Drop into any React/Next.js page.
 *
 * Animation loop (repeats every ~4 s):
 *  1. Lean left 8°
 *  2. Eyes close
 *  3. Smile grows 15%
 *  4. Lean right 8°
 *  5. Eyes open
 *  6. Bounce up 8 px
 *  7. Sparkles appear (300 ms)
 *  8. Return to idle → pause → repeat
 */

import { useEffect } from "react";
import { motion, useAnimate, AnimationScope } from "framer-motion";

// ─── Ease helpers ─────────────────────────────────────────────────────────────
const EASE_SMOOTH = [0.45, 0, 0.55, 1] as const;
const EASE_BOUNCE_OUT = [0.34, 1.56, 0.64, 1] as const;

// ─── Sparkle positions (relative to blob centre) ─────────────────────────────
const SPARKLES = [
  { id: "s1", x:  68, y: -55, color: "#FACC15", size: 14, delay: 0    },
  { id: "s2", x:  90, y:   0, color: "#A855F7", size: 10, delay: 0.04 },
  { id: "s3", x: -72, y: -40, color: "#60A5FA", size: 12, delay: 0.07 },
  { id: "s4", x: -85, y:  15, color: "#FACC15", size:  8, delay: 0.02 },
  { id: "s5", x:  20, y: -80, color: "#A855F7", size: 10, delay: 0.05 },
];

// ─── Sparkle shape ─────────────────────────────────────────────────────────────
function StarShape({ size, color }: { size: number; color: string }) {
  const h = size / 2;
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      <path
        d={`M${h} 0 L${h * 1.12} ${h * 0.78} L${size} ${h}
            L${h * 1.12} ${h * 1.22} L${h} ${size}
            L${h * 0.88} ${h * 1.22} L0 ${h}
            L${h * 0.88} ${h * 0.78} Z`}
        fill={color}
      />
    </svg>
  );
}

// ─── Animation loop ───────────────────────────────────────────────────────────
async function runLoop(animate: AnimationScope<any>[1]) {
  const dur  = (d: number) => ({ duration: d });
  const ease = (d: number, e: readonly number[]) => ({ duration: d, ease: e });

  while (true) {
    // 1 · Lean left
    await animate("#blob", { rotate: -8 }, ease(0.45, EASE_SMOOTH));

    // 2 · Eyes close  (scaleY → 0.08 = thin line)
    await animate(".eye", { scaleY: 0.08 }, ease(0.2, EASE_SMOOTH));

    // 3 · Smile grows 15%
    await animate("#smile", { scaleX: 1.15 }, ease(0.3, EASE_SMOOTH));

    // 4 · Lean right
    await animate("#blob", { rotate: 8 }, ease(0.5, EASE_SMOOTH));

    // 5 · Eyes open
    await animate(".eye", { scaleY: 1 }, ease(0.22, EASE_BOUNCE_OUT));

    // 6 · Bounce up (return rotate to 0 simultaneously)
    await animate("#blob", { rotate: 0, y: -8 }, ease(0.28, EASE_BOUNCE_OUT));

    // 7 · Sparkles in — fire & forget so bounce-down overlaps
    animate(".sparkle", { opacity: 1, scale: 1 }, { duration: 0.15, ease: "easeOut" });
    await animate("#blob", { y: 0 }, ease(0.32, EASE_SMOOTH));

    // hold sparkles briefly then fade
    await new Promise<void>((r) => setTimeout(r, 80));
    await animate(".sparkle", { opacity: 0, scale: 0.4 }, ease(0.25, EASE_SMOOTH));

    // 8 · Smile back to normal
    await animate("#smile", { scaleX: 1 }, ease(0.3, EASE_SMOOTH));

    // idle pause before next loop
    await new Promise<void>((r) => setTimeout(r, 1_400));
  }
}

// ─── Component ────────────────────────────────────────────────────────────────
interface Props {
  size?: number;
}

export default function MascotCompanion({ size = 160 }: Props) {
  const [scope, animate] = useAnimate();

  useEffect(() => {
    runLoop(animate);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const cx = size / 2;
  const cy = size / 2;
  const r  = size * 0.42;

  // Eye geometry
  const eyeRx  = size * 0.055;
  const eyeRy  = size * 0.065;
  const eyeY   = cy - size * 0.06;
  const eyeOffX = size * 0.14;

  // Smile arc (SVG path — a gentle arc)
  const smileY  = cy + size * 0.1;
  const smileW  = size * 0.28;
  const smileH  = size * 0.09;
  const smilePath = `
    M ${cx - smileW} ${smileY}
    Q ${cx} ${smileY + smileH * 2} ${cx + smileW} ${smileY}
  `;

  return (
    <div ref={scope} style={{ position: "relative", width: size, height: size }}>

      {/* ── Sparkles (absolutely positioned, hidden by default) ── */}
      {SPARKLES.map((sp) => (
        <motion.div
          key={sp.id}
          className="sparkle"
          initial={{ opacity: 0, scale: 0 }}
          style={{
            position: "absolute",
            left: cx + sp.x - sp.size / 2,
            top:  cy + sp.y - sp.size / 2,
            transformOrigin: "center",
          }}
        >
          <StarShape size={sp.size} color={sp.color} />
        </motion.div>
      ))}

      {/* ── Blob + face ── */}
      <motion.svg
        id="blob"
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        style={{ position: "absolute", top: 0, left: 0, transformOrigin: "center bottom" }}
        initial={{ rotate: 0, y: 0 }}
      >
        {/* Drop shadow */}
        <ellipse
          cx={cx}
          cy={size * 0.93}
          rx={r * 0.7}
          ry={size * 0.035}
          fill="rgba(59,130,246,0.18)"
        />

        {/* Body blob */}
        <circle cx={cx} cy={cy} r={r} fill="#3B82F6" />

        {/* Left arm / hand */}
        <circle cx={cx - r * 0.88} cy={cy + r * 0.42} r={r * 0.22} fill="#2563EB" />
        {/* Right arm / hand */}
        <circle cx={cx + r * 0.88} cy={cy + r * 0.42} r={r * 0.22} fill="#2563EB" />

        {/* Left foot */}
        <circle cx={cx - r * 0.38} cy={cy + r * 1.02} r={r * 0.18} fill="#2563EB" />
        {/* Right foot */}
        <circle cx={cx + r * 0.38} cy={cy + r * 1.02} r={r * 0.18} fill="#2563EB" />

        {/* ── Eyes ── */}
        <motion.ellipse
          className="eye"
          cx={cx - eyeOffX}
          cy={eyeY}
          rx={eyeRx}
          ry={eyeRy}
          fill="#1E293B"
          style={{ transformOrigin: `${cx - eyeOffX}px ${eyeY}px` }}
          initial={{ scaleY: 1 }}
        />
        <motion.ellipse
          className="eye"
          cx={cx + eyeOffX}
          cy={eyeY}
          rx={eyeRx}
          ry={eyeRy}
          fill="#1E293B"
          style={{ transformOrigin: `${cx + eyeOffX}px ${eyeY}px` }}
          initial={{ scaleY: 1 }}
        />

        {/* ── Smile ── */}
        <motion.path
          id="smile"
          d={smilePath}
          stroke="#1E293B"
          strokeWidth={size * 0.028}
          strokeLinecap="round"
          fill="none"
          style={{ transformOrigin: `${cx}px ${smileY}px` }}
          initial={{ scaleX: 1 }}
        />
      </motion.svg>

    </div>
  );
}
