/**
 * Configuration helper for backend API and WebSocket endpoints.
 */

export function getApiBaseUrl(): string {
  if (process.env.NEXT_PUBLIC_API_URL) {
    return process.env.NEXT_PUBLIC_API_URL.replace(/\/+$/, "");
  }

  if (typeof window !== "undefined") {
    const isLocal =
      window.location.hostname === "localhost" ||
      window.location.hostname === "127.0.0.1";
    if (isLocal) {
      return "http://localhost:8080";
    }
  }

  return "https://sus-word.onrender.com";
}

export function getWsBaseUrl(): string {
  if (process.env.NEXT_PUBLIC_WS_URL) {
    return process.env.NEXT_PUBLIC_WS_URL.replace(/\/+$/, "");
  }

  const apiBase = getApiBaseUrl();
  if (apiBase.startsWith("https://")) {
    return apiBase.replace("https://", "wss://") + "/ws";
  }
  return apiBase.replace("http://", "ws://") + "/ws";
}

export function buildWsUrl(roomCode: string, displayName: string): string {
  const base = getWsBaseUrl();
  const params = new URLSearchParams({
    room: roomCode.trim().toUpperCase(),
    name: displayName.trim(),
  });
  return `${base}?${params.toString()}`;
}
