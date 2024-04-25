import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { GeistSans } from "geist/font/sans";


const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "May Vacation Tracker",
  description: "beep boop",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} ${GeistSans.className} bg-stone-950 text-slate-200`}>
        {children}
        </body>
    </html>
  );
}
