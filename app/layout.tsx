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
  variable: "--font-body",
});

const germaniaOne = Germania_One({
  subsets: ["latin"],
  weight: ["400"],
  variable: "--font-germania",
});

export const metadata: Metadata = {
  title: "Oddword — Imposter Party Game",
  description:
    "The party word game of hidden deception. Pass your phone around or play online — can you find the odd one out?",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Oddword",
  },
  icons: {
    icon: [
      { url: "/favicon.ico" },
      { url: "/favicon.png", type: "image/png", sizes: "64x64" },
      { url: "/icon.svg", type: "image/svg+xml" },
    ],
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
  },
};

export const viewport: Viewport = {
  themeColor: "#08090C",
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
