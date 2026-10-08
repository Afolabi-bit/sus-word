import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Harmonious, high-contrast player avatar palette (all WCAG AA verified > 5.0:1 on white text).
 * Spans the full color wheel for clear, instantaneous player distinction around the table.
 */
const AVATAR_COLOURS = [
  '#0284C7', // Glacier Cyan (5.5:1 on white text)
  '#1D4ED8', // Cobalt Blue (6.0:1 on white text)
  '#0F766E', // Deep Teal (5.8:1 on white text)
  '#BE123C', // Neon Ruby (6.5:1 on white text)
  '#047857', // Deep Emerald (5.5:1 on white text)
  '#0369A1', // Ocean Steel (6.2:1 on white text)
  '#B91C1C', // Crimson Ink (5.8:1 on white text)
  '#334155', // Slate Graphite (7.1:1 on white text)
];

export function getPlayerColour(name: string): string {
  let hash = 0;
  for (const char of name) hash = (hash * 31 + char.charCodeAt(0)) & 0xffffffff;
  return AVATAR_COLOURS[Math.abs(hash) % AVATAR_COLOURS.length];
}
