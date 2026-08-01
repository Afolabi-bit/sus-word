"use client";

import { useEffect } from "react";

export default function ServiceWorkerRegister() {
  useEffect(() => {
    if ("serviceWorker" in navigator) {
      window.addEventListener("load", () => {
        navigator.serviceWorker
          .register("/sw.js")
          .then((reg) => {
            console.log("SusWord PWA Service Worker registered:", reg.scope);
          })
          .catch((err) => {
            console.error("SusWord Service Worker registration failed:", err);
          });
      });
    }
  }, []);

  return null;
}
