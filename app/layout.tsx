import type { Metadata } from "next";
import { Anton, Manrope, Space_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { LanguageProvider } from "@/context/LanguageContext";
import { ThemeProvider } from "@/context/ThemeContext";
import { siteConfig } from "@/lib/site-config";

const anton = Anton({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-anton",
  display: "swap",
});

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-manrope",
  display: "swap",
});

const spaceMono = Space_Mono({
  weight: ["400", "700"],
  subsets: ["latin"],
  variable: "--font-space-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: `${siteConfig.shopName} - Customer Loyalty Scheme & Mega Raffle Draw`,
  description:
    "Official customer reward and digital raffle draw system for IDK electronics retail shop.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="bn" className="dark scroll-smooth">
      <body
        className={`${anton.variable} ${manrope.variable} ${spaceMono.variable} font-sans min-h-screen flex flex-col bg-[#0F172A] text-[#F8FAFC] selection:bg-[#E5A93C] selection:text-[#0F172A] antialiased relative`}
      >
        <ThemeProvider>
          <LanguageProvider>
            {/* Top Atmospheric Ambient Glows */}
            <div className="fixed top-0 left-1/4 -translate-x-1/2 w-96 h-96 bg-[#E5A93C]/15 rounded-full blur-3xl pointer-events-none -z-10" />
            <div className="fixed top-20 right-1/4 translate-x-1/2 w-96 h-96 bg-[#3B82F6]/10 rounded-full blur-3xl pointer-events-none -z-10" />
            <div className="fixed bottom-0 left-1/3 w-80 h-80 bg-[#E5A93C]/10 rounded-full blur-3xl pointer-events-none -z-10" />

            <div className="luxury-bg min-h-screen flex flex-col">
              <Navbar />
              <main className="flex-1 w-full">{children}</main>
              <Footer />
            </div>
          </LanguageProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
