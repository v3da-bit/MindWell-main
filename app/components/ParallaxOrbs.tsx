"use client";

import { motion, useScroll, useTransform } from "framer-motion";

export default function ParallaxOrbs() {
  const { scrollY } = useScroll();

  const y1 = useTransform(scrollY, [0, 600], [0, -50]);
  const y2 = useTransform(scrollY, [0, 600], [0, 60]);
  const y3 = useTransform(scrollY, [0, 600], [0, -30]);

  return (
    <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      <motion.div
        style={{ y: y1 }}
        className="absolute -top-10 -left-10 h-56 w-56 rounded-full bg-emerald-300/30 blur-3xl"
      />
      <motion.div
        style={{ y: y2 }}
        className="absolute bottom-20 right-10 h-72 w-72 rounded-full bg-blue-300/30 blur-3xl"
      />
      <motion.div
        style={{ y: y3 }}
        className="absolute top-1/3 right-1/4 h-40 w-40 rounded-full bg-cyan-300/25 blur-3xl"
      />
    </div>
  );
}
