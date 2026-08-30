import type { Metadata } from "next";
import { Anton, Manrope, Space_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import { siteConfig } from "@/lib/site-config";
import { LanguageProvider } from "@/context/LanguageContext";
import Footer from "@/components/Footer";

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
  title: `${siteConfig.shopName} - Customer Loyalty Raffle & Grand Prize Draw`,
  description: `Official loyalty reward raffle system for ${siteConfig.shopName}. Buy qualifying products, receive a certified raffle ticket, and win exciting electronic grand prizes.`,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="bn"
      className={`${anton.variable} ${manrope.variable} ${spaceMono.variable}`}
    >
      <body className="retail-bg min-h-screen flex flex-col font-sans antialiased text-slate-900 bg-slate-50">
        <LanguageProvider>
          <Navbar />
          
          <main className="flex-1">
            {children}
          </main>

          <Footer />
        </LanguageProvider>
      </body>
    </html>
  );
}
