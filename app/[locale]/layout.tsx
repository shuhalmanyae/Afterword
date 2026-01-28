import type { Metadata } from "next";
import { Inter, Playfair_Display, JetBrains_Mono, Dancing_Script, Cinzel, Montserrat } from "next/font/google";
import "../globals.css";
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { notFound } from 'next/navigation';
import NavigationMenu from "@/components/NavigationMenu";
import Footer from "@/components/Footer";
import BackgroundVideo from "@/components/BackgroundVideo";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import Logo from "@/components/Logo";
import { UIProvider } from "@/components/UIProvider";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
});

const jetbrains = JetBrains_Mono({
  variable: "--font-jetbrains",
  subsets: ["latin"],
});

const dancing = Dancing_Script({
  variable: "--font-dancing",
  subsets: ["latin"],
});

const cinzel = Cinzel({
  variable: "--font-cinzel",
  subsets: ["latin"],
});

const montserrat = Montserrat({
  variable: "--font-montserrat",
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
    <html lang={locale} suppressHydrationWarning>
      <body className={`${inter.variable} ${playfair.variable} ${jetbrains.variable} ${dancing.variable} ${cinzel.variable} ${montserrat.variable} antialiased min-h-screen flex flex-col bg-background text-foreground`} suppressHydrationWarning>
        <NextIntlClientProvider messages={messages}>
          <UIProvider>
            <Logo className="fixed md:top-8 md:left-8 top-6 left-6 z-[100] text-lg md:text-xl drop-shadow-md" />
            <BackgroundVideo />
            <LanguageSwitcher />
            <NavigationMenu />
            {children}
            <Footer />
          </UIProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
