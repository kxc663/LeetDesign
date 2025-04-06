import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import Navbar from "../components/NavBar";
import { AuthProvider } from '@/hooks/AuthContext'; // <-- correct import

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "LeetDesign | System Design Practice Platform",
  description: "Learn and practice system design with a curated problem bank, guided prompts, and reference solutions.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <AuthProvider> {/* ✅ Add AuthProvider here */}
          <Navbar />
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
