import type { Metadata } from "next";
import { Inter, Poppins } from "next/font/google";
import "./globals.css";
import "./themes.css";
// ...existing code...
import ScrollProgress from "@/app/components/ScrollProgress";
import SmoothScroll from "@/app/components/SmoothScroll";
import PageTransition from "@/app/components/PageTransition";

const primaryFont = Inter({
  weight: ["300", "400", "500", "600"],
  subsets: ["latin"],
});

const poppins = Poppins({
  weight: ["300", "400", "500", "600", "700"],
  subsets: ["latin"],
  variable: "--font-poppins",
});

// Change the title and description to your own.
export const metadata: Metadata = {
  title: "MindWell - Mental Health Support for Students",
  description: "A stigma-free digital mental health platform providing AI support, counseling, resources, and peer community for students in higher education.",
  icons: {
    icon: '/M.ico',
    shortcut: '/M.ico',
    apple: '/M.ico',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${primaryFont.className} ${poppins.variable}`}>
      <body className="antialiased">
          <main className="min-h-screen">
            <ScrollProgress />
            <SmoothScroll />
            <PageTransition>{children}</PageTransition>
          </main>
          {/* Removed ThemeProvider as it is not needed */}
      </body>
    </html>
  );
}
