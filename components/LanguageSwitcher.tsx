"use client";

import { usePathname, useRouter } from "@/i18n/routing";
import { motion, AnimatePresence } from "framer-motion";
import { Globe } from "lucide-react";
import { useLocale } from "next-intl";
import { useUI } from "@/components/UIProvider";

export default function LanguageSwitcher() {
    const { isLangOpen, toggleLang, closeAll, isGlobalNavForced } = useUI();
    const pathname = usePathname();
    const router = useRouter();
    const currentLocale = useLocale();

    if (pathname && pathname.includes("/verify") && !isGlobalNavForced) return null;

    const locales = [
        { code: "en", label: "EN" },
        { code: "de", label: "DE" },
        { code: "fr", label: "FR" },
        { code: "it", label: "IT" },
    ];

    const currentLang = locales.find(l => l.code === currentLocale) || locales[0];

    // Function to switch language
    const switchLanguage = (locale: string) => {
        closeAll(); // Close the menu
        router.replace(pathname, { locale });
    };

    return (
        <div className="fixed top-8 right-24 z-[100]">
            <div className="relative">
                {/* Toggle Button */}
                <button
                    onClick={toggleLang}
                    className="flex items-center gap-2 px-4 py-3 bg-transparent backdrop-blur-md border border-white/30 rounded-full text-white hover:border-white/80 transition-all duration-500 group"
                >
                    <Globe className="w-4 h-4 text-white/70 group-hover:text-white transition-colors" />
                    <span className="text-xs font-bold tracking-widest uppercase">{currentLang.label}</span>
                </button>

                {/* Dropdown Menu */}
                <AnimatePresence>
                    {isLangOpen && (
                        <>
                            {/* Backdrop to close on click outside */}
                            <div
                                className="fixed inset-0 z-[90]"
                                onClick={closeAll}
                            />

                            <motion.div
                                initial={{ opacity: 0, y: -10, scale: 0.95 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                exit={{ opacity: 0, y: -10, scale: 0.95 }}
                                transition={{ duration: 0.2 }}
                                className="absolute right-0 top-14 w-full min-w-[80px] z-[95] flex flex-col gap-2"
                            >
                                {locales.map((locale) => (
                                    <button
                                        key={locale.code}
                                        onClick={() => switchLanguage(locale.code)}
                                        className={`px-4 py-3 bg-black/60 backdrop-blur-md border border-white/10 rounded-full text-white/70 hover:text-white hover:border-white/50 transition-all duration-300 text-xs font-bold tracking-widest uppercase flex items-center justify-center ${currentLocale === locale.code ? "bg-white/10 text-white border-white/40" : ""
                                            }`}
                                    >
                                        {locale.label}
                                    </button>
                                ))}
                            </motion.div>
                        </>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}
