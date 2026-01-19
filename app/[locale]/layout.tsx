import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "../globals.css";
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { notFound } from 'next/navigation';
import NavigationMenu from "@/components/NavigationMenu";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Afterword | Secure Digital Legacy",
  description: "The Swiss digital vault for your final messages.",
};

export default async function RootLayout({
  children,
  params
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  // Ensure that the incoming `locale` is valid
  if (!['en', 'de', 'fr', 'it'].includes(locale as any)) {
    notFound();
  }

  // Providing all messages to the client
  // side is the easiest way to get started
  const messages = await getMessages();

  return (
    <html lang={locale}>
      <body className={`${inter.variable} antialiased`}>
        <NextIntlClientProvider messages={messages}>
          <NavigationMenu />
          {children}
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
