import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

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

const saans = localFont({
  src: [
    {
      path: "./fonts/Saans-Regular.woff",
      weight: "500",
    },
    {
      path: "./fonts/Saans-SemiBold.woff",
      weight: "600 900"
    }
  ],
  variable: "--font-sans",
});

const saansSemi = localFont({
  src: "./fonts/Saans-SemiBold.woff",
});

export const metadata: Metadata = {
  title: "Pulse",
  description: "Vibe the city, feel the pulse.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${saans.variable} ${geistSans.variable} ${geistMono.variable}  antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
