import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { ThemeProvider } from "@/components/ThemeProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Whabot Landing Builder - Generador Visual de Landings",
  description: "Generador visual de landings basado en React + Next.js con integración de IA, bloques reutilizables y build optimizado.",
  keywords: ["Whabot", "Landing Builder", "Next.js", "TypeScript", "Tailwind CSS", "shadcn/ui", "AI development", "React"],
  authors: [{ name: "Arrobatouch" }],
  icons: {
    icon: "/favicon.ico",
  },
  openGraph: {
    title: "Whabot Landing Builder",
    description: "Generador visual de landings con IA",
    url: "https://whabot.com.ar",
    siteName: "Whabot",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Whabot Landing Builder",
    description: "Generador visual de landings con IA",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
