"use client";

import { useEffect } from "react";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed"; platform: string }>;
}

export default function PWAInstallPrompt() {
  useEffect(() => {
    // Only target mobile devices
    const userAgent = window.navigator.userAgent.toLowerCase();
    const isMobile = /android|iphone|ipad|ipod|blackberry|windows phone|mobile/i.test(userAgent);

    if (!isMobile) return;

    // Check if already running in installed standalone mode
    const isStandalone =
      window.matchMedia("(display-mode: standalone)").matches ||
      (window.navigator as unknown as { standalone?: boolean }).standalone === true;

    if (isStandalone) return;

    // Listen for native beforeinstallprompt event on mobile browsers
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      const promptEvent = e as BeforeInstallPromptEvent;

      // Trigger standard browser native install prompt immediately on mobile load
      promptEvent.prompt().catch(() => {
        /* Browser handled prompt */
      });
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    };
  }, []);

  return null;
}
