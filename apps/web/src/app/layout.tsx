import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Providers from "./providers";
import Navbar from "@/app/components/navbar";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "EventManager",
  description: "Create, manage, and attend events with ease",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Providers>
          <div className="min-h-screen flex flex-col">
            {/* Top navigation */}
            <Navbar />

            {/* Main content */}
            <main className="flex-1">
              <div className="mx-auto max-w-5xl px-4 py-8">
                {children}
              </div>
            </main>

            {/* Footer */}
            <footer className="border-t bg-white/60 backdrop-blur">
              <div className="mx-auto max-w-5xl px-4 py-6 text-sm text-gray-500 flex items-center justify-between">
                <span>© {new Date().getFullYear()} EventManager</span>
                <span className="hidden sm:block">All Rights Reserved</span>
              </div>
            </footer>
          </div>
        </Providers>
      </body>
    </html>
  );
}
