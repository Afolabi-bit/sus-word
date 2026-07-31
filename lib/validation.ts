import { z } from "zod";

/** Schema for a single player name (without context of existing players). */
export const playerNameSchema = z
  .string()
  .trim()
  .min(1, "Name cannot be empty")
  .max(20, "Name must be 20 characters or fewer");

/**
 * Validates a player name against the existing player list.
 * Returns `{ success: true, name: string }` or `{ success: false, error: string }`.
 */
export function validatePlayerName(
  rawName: string,
  existingPlayers: string[]
): { success: true; name: string } | { success: false; error: string } {
  const parsed = playerNameSchema.safeParse(rawName);

  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0].message };
  }

  const name = parsed.data;
  const isDuplicate = existingPlayers.some(
    (p) => p.toLowerCase() === name.toLowerCase()
  );

  if (isDuplicate) {
    return { success: false, error: "This name is already taken" };
  }

  return { success: true, name };
}

/** Check whether the player list meets the requirements to start a game. */
export function canStartGame(players: string[]): {
  valid: boolean;
  error?: string;
} {
  if (players.length < 4) {
    return {
      valid: false,
      error: `Need at least 4 players (currently ${players.length})`,
    };
  }
  if (players.length > 10) {
    return {
      valid: false,
      error: `Maximum 10 players allowed (currently ${players.length})`,
    };
  }
  return { valid: true };
}
