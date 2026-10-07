import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

const AVATAR_COLOURS = [
  '#B45309', // Amber-700 (5.02:1 on white text)
  '#BE123C', // Crimson-700 (6.29:1 on white text)
  '#047857', // Emerald-700 (5.48:1 on white text)
  '#C2410C', // Orange-700 (5.18:1 on white text)
  '#9F1239', // Rose-800 (8.02:1 on white text)
  '#065F46', // Emerald-800 (7.68:1 on white text)
  '#9A3412', // Warm Earth-800 (7.31:1 on white text)
  '#881337', // Burgundy-900 (9.57:1 on white text)
];

export function getPlayerColour(name: string): string {
  let hash = 0;
  for (const char of name) hash = (hash * 31 + char.charCodeAt(0)) & 0xffffffff;
  return AVATAR_COLOURS[Math.abs(hash) % AVATAR_COLOURS.length];
}

