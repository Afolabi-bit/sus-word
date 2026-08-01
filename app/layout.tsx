import type { Metadata, Viewport } from "next";
import { Lato, Germania_One } from "next/font/google";
import ServiceWorkerRegister from "@/components/ServiceWorkerRegister";
import PWAInstallPrompt from "@/components/PWAInstallPrompt";
import "./globals.css";

const lato = Lato({
  subsets: ["latin"],
  weight: ["400", "700", "900"],
  variable: "--font-lato",
});

const germaniaOne = Germania_One({
  subsets: ["latin"],
  weight: ["400"],
  variable: "--font-germania",
});

export const metadata: Metadata = {
  title: "SusWord — Imposter Word Game",
  description:
    "Find the imposter among your friends! Play offline pass-and-play or join online multiplayer.",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "SusWord",
  },
  icons: {
    icon: "/icon-192.png",
    apple: "/apple-touch-icon.png",
  },
};

export const viewport: Viewport = {
  themeColor: "#EF9F27",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`h-full antialiased ${lato.variable} ${germaniaOne.variable}`}
    >
      <head>
        {/* Dark mode detection — sets .dark class before first paint */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
                    document.documentElement.classList.add('dark');
                  }
                } catch(e) {}
              })();
            `,
          }}
        />
      </head>
      <body className="min-h-full flex flex-col font-sans">
        <ServiceWorkerRegister />
        <PWAInstallPrompt />
        {children}
      </body>
    </html>
  );
}
