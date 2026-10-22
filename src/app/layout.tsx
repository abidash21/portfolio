import type { Metadata, Viewport } from "next";
import { Bricolage_Grotesque, JetBrains_Mono } from "next/font/google";
import { MathBackground } from "@/components/math-background";
import { ScrollProgress } from "@/components/scroll-progress";
import { profile } from "@/content/resume";
import { site, siteUrl } from "@/content/site";
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
  metadataBase: siteUrl,
  title: site.title,
  description: site.description,
  applicationName: profile.name,
  authors: [{ name: profile.name, url: siteUrl }],
  creator: profile.name,
  keywords: site.keywords,
  alternates: { canonical: "/" },
  openGraph: {
    type: "profile",
    url: "/",
    siteName: profile.name,
    locale: site.locale,
    title: site.title,
    description: site.shareDescription,
    firstName: "Abinash",
    lastName: "Dash",
  },
  twitter: {
    card: "summary_large_image",
    title: site.title,
    description: site.shareDescription,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  formatDetection: { telephone: false, email: false, address: false },
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
