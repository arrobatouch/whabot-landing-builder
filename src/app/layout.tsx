import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
<<<<<<< HEAD
=======
import { ThemeProvider } from "@/components/ThemeProvider";
>>>>>>> 1738e6cdd56ec36c3db0b938f85d9822554f81df

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
<<<<<<< HEAD
  title: "Z.ai Code Scaffold - AI-Powered Development",
  description: "Modern Next.js scaffold optimized for AI-powered development with Z.ai. Built with TypeScript, Tailwind CSS, and shadcn/ui.",
  keywords: ["Z.ai", "Next.js", "TypeScript", "Tailwind CSS", "shadcn/ui", "AI development", "React"],
  authors: [{ name: "Z.ai Team" }],
  icons: {
    icon: "https://z-cdn.chatglm.cn/z-ai/static/logo.svg",
  },
  openGraph: {
    title: "Z.ai Code Scaffold",
    description: "AI-powered development with modern React stack",
    url: "https://chat.z.ai",
    siteName: "Z.ai",
=======
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
>>>>>>> 1738e6cdd56ec36c3db0b938f85d9822554f81df
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
<<<<<<< HEAD
    title: "Z.ai Code Scaffold",
    description: "AI-powered development with modern React stack",
=======
    title: "Whabot Landing Builder",
    description: "Generador visual de landings con IA",
>>>>>>> 1738e6cdd56ec36c3db0b938f85d9822554f81df
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
<<<<<<< HEAD
        {children}
        <Toaster />
=======
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
          <Toaster />
        </ThemeProvider>
>>>>>>> 1738e6cdd56ec36c3db0b938f85d9822554f81df
      </body>
    </html>
  );
}
