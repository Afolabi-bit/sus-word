"use client";

import { motion } from "framer-motion";
import { ReactNode } from "react";

interface GameShellProps {
  children: ReactNode;
  /** Optional key for AnimatePresence transitions */
  phaseKey?: string;
}

const variants = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -12 },
};

/**
 * Shared layout wrapper for all game screens.
 * Provides centered max-width container, generous padding, and motion transitions.
 */
export default function GameShell({ children, phaseKey }: GameShellProps) {
  return (
    <motion.div
      key={phaseKey}
      variants={variants}
      initial="initial"
      animate="animate"
      exit="exit"
      transition={{ duration: 0.25, ease: "easeOut" }}
      className="flex flex-1 flex-col items-center justify-center w-full max-w-md sm:max-w-lg md:max-w-xl mx-auto px-4 sm:px-6 md:px-8 py-6 sm:py-10"
    >
      {children}
    </motion.div>
  );
}
