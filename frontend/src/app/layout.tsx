import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { ChatWidget } from "@/components/ChatWidget";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Physical AI & Humanoid Robotics",
  description: "A comprehensive textbook for teaching Physical AI and Humanoid Robotics with ROS 2, Gazebo, NVIDIA Isaac, and Vision-Language-Action models.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${inter.variable} ${jetbrainsMono.variable} antialiased bg-gray-50`}
      >
        {children}
        <ChatWidget />
      </body>
    </html>
  );
}
