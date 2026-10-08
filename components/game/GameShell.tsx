"use client";

import { motion } from "framer-motion";
import { ReactNode } from "react";

interface GameShellProps {
  children: ReactNode;
  /** Optional key for AnimatePresence transitions */
  phaseKey?: string;
  /** Layout mode: centered (default) or scrollable for long content lists */
  layout?: "centered" | "scrollable";
}

const variants = {
  initial: { opacity: 0, y: 16, filter: "blur(4px)" },
  animate: { opacity: 1, y: 0, filter: "blur(0px)" },
  exit: { opacity: 0, y: -16, filter: "blur(4px)" },
};

/**
 * Shared layout wrapper for all game screens.
 * Uses .layout-container for consistent edge alignment and padding across views.
 */
export default function GameShell({
  children,
  phaseKey,
  layout = "centered",
}: GameShellProps) {
  const isScrollable = layout === "scrollable";

  return (
    <motion.div
      key={phaseKey}
      variants={variants}
      initial="initial"
      animate="animate"
      exit="exit"
      transition={{ duration: 0.2, ease: [0.2, 0, 0, 1] }}
      className={`layout-container w-full flex flex-1 flex-col items-center ${
        isScrollable
          ? "justify-start py-4 sm:py-6"
          : "justify-center py-4 sm:py-6 my-auto"
      }`}
    >
      {children}
    </motion.div>
  );
}
