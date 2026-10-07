import type { Metadata, Viewport } from "next";
import { Syne, Inter, Germania_One } from "next/font/google";
import ServiceWorkerRegister from "@/components/ServiceWorkerRegister";
import PWAInstallPrompt from "@/components/PWAInstallPrompt";
import "./globals.css";

const syne = Syne({
  subsets: ["latin"],
  weight: ["600", "700", "800"],
  variable: "--font-heading",
});

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-body",
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
  themeColor: "#F5A623",
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
      className={`h-full antialiased ${syne.variable} ${inter.variable} ${germaniaOne.variable}`}
    >
      <head>
        {/* Dark mode detection — sets .dark class before first paint */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var mq = window.matchMedia('(prefers-color-scheme: dark)');
                  if (mq.matches) {
                    document.documentElement.classList.add('dark');
                  }
                  mq.addEventListener('change', function(e) {
                    document.documentElement.classList.add('no-transitions');
                    if (e.matches) {
                      document.documentElement.classList.add('dark');
                    } else {
                      document.documentElement.classList.remove('dark');
                    }
                    requestAnimationFrame(function() {
                      requestAnimationFrame(function() {
                        document.documentElement.classList.remove('no-transitions');
                      });
                    });
                  });
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
