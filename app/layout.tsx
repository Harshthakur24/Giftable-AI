import type { Metadata } from "next";
import { Providers } from "@/components/providers";

import "./globals.css";
import HeaderMenu from "@/components/header-menu";

export const metadata: Metadata = {
  title: "Giftable AI - Your Smart Gift Assistant for Every Occasion",
  description:
    "Find perfect gifts effortlessly with Giftable AI! Get personalized recommendations for Indian festivals, birthdays, anniversaries and more. Free AI-powered gift discovery.",
  keywords:
    "giftable ai, gifts, gift ideas, AI gift advisor, personalized gifts, Indian festivals, Diwali gifts, birthday gifts, anniversary gifts",
  authors: [
    {
      name: "Harsh Thakur",
      url: "https://harshthakur.xyz",
    },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="bg-mint-10">
      <head>
        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href="/apple-touch-icon.png?v=1"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href="/favicon-32x32.png?v=1"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href="/favicon-16x16.png?v=1"
        />
        <link rel="manifest" href="/site.webmanifest?v=1" />
        <link
          rel="mask-icon"
          href="/safari-pinned-tab.svg?v=1"
          color="#fd9745"
        />
        <link rel="shortcut icon" href="/favicon.ico?v=1" />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1.0"
        ></meta>
        <meta name="apple-mobile-web-app-title" content="GiftIdea.io" />
        <meta name="application-name" content="GiftIdea.io" />
        <meta name="msapplication-TileColor" content="#6e61ff" />
        <meta name="theme-color" content="#f1f6f1" />
      </head>
      <body>
        <Providers>
          <div className="flex flex-col min-h-screen">
            <HeaderMenu />
            <main className="flex flex-col flex-1">{children}</main>
          </div>
        </Providers>
      </body>
    </html>
  );
}
