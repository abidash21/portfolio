import type { Metadata, Viewport } from "next";
import { Bricolage_Grotesque, JetBrains_Mono } from "next/font/google";
import { MathBackground } from "@/components/math-background";
import { ScrollProgress } from "@/components/scroll-progress";
import "./globals.css";

const bricolage = Bricolage_Grotesque({
  variable: "--font-bricolage",
  subsets: ["latin"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Abinash Dash — Software Engineer",
  description:
    "Software engineer building lending systems at Equall with Spring Boot, Kafka and Kotlin. Based in Bengaluru.",
  openGraph: {
    title: "Abinash Dash — Software Engineer",
    description:
      "Backend and distributed systems: loan journeys, Kafka pipelines, document engines.",
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: "#121315",
  colorScheme: "dark",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${bricolage.variable} ${jetbrainsMono.variable} antialiased`}
    >
      <body className="min-h-dvh">
        <MathBackground />
        <ScrollProgress />
        {children}
      </body>
    </html>
  );
}
