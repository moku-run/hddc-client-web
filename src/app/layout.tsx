import type { Metadata } from "next";
import { Geist_Mono } from "next/font/google";
import { ThemeProvider } from "@/components/theme-provider";
import {
  ColorThemeProvider,
  ColorThemeScript,
} from "@/components/color-theme-provider";
import { ErrorBoundary } from "@/components/error-boundary";
import { Toaster } from "@/components/ui/sonner";
import { cn } from "@/lib/utils";
import "pretendard/dist/web/variable/pretendardvariable-dynamic-subset.css";
import "./globals.css";

const geistMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
});

export const metadata: Metadata = {
  title: "HDDC — 나만의 프로필 링크",
  description:
    "하나의 링크로 모든 것을 연결하세요. SNS, 포트폴리오, 블로그를 깔끔한 프로필 페이지로.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="ko"
      suppressHydrationWarning
      className={cn("antialiased", geistMono.variable)}
    >
      <head>
        <ColorThemeScript />
      </head>
      <body>
        <ThemeProvider>
          <ColorThemeProvider>
            <ErrorBoundary>
              {children}
            </ErrorBoundary>
            <Toaster />
          </ColorThemeProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
