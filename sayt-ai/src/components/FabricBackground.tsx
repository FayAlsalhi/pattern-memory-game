'use client';

import { motion, useScroll, useTransform } from 'motion/react';

/**
 * Fixed, full-viewport textile surface: deep indigo cloth with a plain-weave
 * micro texture, large soft folds, film grain and a directional key light
 * that travels as the page scrolls (inspired by the reference film's
 * lavender light flooding across a grainy indigo field).
 */
export function FabricBackground() {
  const { scrollYProgress } = useScroll();
  const lightX = useTransform(scrollYProgress, [0, 0.5, 1], ['-10%', '35%', '-5%']);
  const lightY = useTransform(scrollYProgress, [0, 1], ['-25%', '40%']);
  const warm = useTransform(scrollYProgress, [0, 0.6, 1], [0.0, 0.25, 0.55]);

  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 overflow-hidden bg-ink-950">
      <div className="absolute inset-0 bg-[radial-gradient(120%_80%_at_80%_0%,#1d1d6b_0%,#0b0f33_45%,#04061a_100%)]" />
      <div className="fabric-folds absolute -inset-[15%] opacity-90" />
      {/* key light */}
      <motion.div
        style={{ x: lightX, y: lightY }}
        className="absolute end-[-20%] top-0 h-[120vh] w-[90vw] rounded-full bg-[radial-gradient(closest-side,rgba(196,181,253,.38),rgba(99,102,241,.16)_45%,transparent_75%)] blur-2xl"
      />
      {/* faint warm counter light toward the end of the page */}
      <motion.div
        style={{ opacity: warm }}
        className="absolute bottom-[-30%] start-[-10%] h-[80vh] w-[70vw] rounded-full bg-[radial-gradient(closest-side,rgba(147,197,253,.28),transparent_70%)] blur-2xl"
      />
      <div className="fabric-weave absolute inset-0 opacity-70 mix-blend-overlay" />
      <div className="fabric-grain absolute -inset-[10%] opacity-[0.14] mix-blend-soft-light" />
      <div className="absolute inset-0 bg-[radial-gradient(130%_90%_at_50%_40%,transparent_55%,rgba(2,3,12,.75)_100%)]" />
    </div>
  );
}
