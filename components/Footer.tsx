"use client";

import { useTranslations } from 'next-intl';
import { Link, usePathname } from '@/i18n/routing';
import { Send } from "lucide-react";
import { useUI } from "@/components/UIProvider";
import Logo from "@/components/Logo";

export default function Footer() {
    const t = useTranslations('Footer'); // Still use basic footer keys
    const tAbout = useTranslations('About.Footer'); // Use About keys for specific company info
    const { openReferralModal, isGlobalNavForced } = useUI();
    const pathname = usePathname();

    if (pathname && pathname.includes("/verify") && !isGlobalNavForced) return null;

    return (
        <footer className="w-full z-50 relative bg-[#050505] text-white">
            <div className="max-w-7xl mx-auto px-6 py-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
                    {/* Col 1: Identity */}
                    <div className="flex flex-col space-y-4">
                        <Logo className="text-xl md:text-2xl" isFooter />
                        <p className="font-sans text-xs font-light text-white/50 mt-1">{tAbout('address')}</p>
                        <p className="text-white/40 text-xs font-light tracking-widest uppercase flex items-center gap-1">
                            {tAbout('designed_by')} <span className="text-sm opacity-80">🇨🇭</span>
                        </p>
                    </div>

                    {/* Col 2: Navigation & Contact */}
                    <div className="flex flex-col space-y-3 text-xs font-light text-white/70">
                        <Link href="/keyholder" className="hover:text-white transition-colors">The Keyholder</Link>
                        <Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link>
                        <Link href="/about" className="hover:text-white transition-colors">How It Works</Link>
                        <Link href="/contact" className="hover:text-white transition-colors">Contact Us</Link>
                        <a
                            href={`mailto:${tAbout('email')}`}
                            className="text-white/50 hover:text-white transition-colors decoration-white/20 hover:decoration-white underline-offset-4 mt-2"
                        >
                            {tAbout('email')}
                        </a>
                    </div>

                    {/* Col 3: Action */}
                    <div className="flex flex-col md:items-end space-y-4">
                        <button
                            onClick={openReferralModal}
                            className="group relative text-white/70 hover:text-white transition-colors text-sm font-medium tracking-wide"
                        >
                            <span className="relative z-10 flex items-center gap-2">
                                {tAbout('referral_link')}
                                <Send className="w-3 h-3 text-white/70 group-hover:text-white transition-colors" />
                            </span>
                            <span className="absolute left-0 -bottom-1 w-full h-px bg-white/20 group-hover:bg-white transition-all duration-300 transform scale-x-0 group-hover:scale-x-100 origin-left"></span>
                        </button>
                    </div>
                </div>

                {/* Socket */}
                <div className="pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-[10px] text-white/20 uppercase tracking-widest">
                    <p>&copy; {new Date().getFullYear()} {t('copyright')}</p>
                    <div className="flex gap-6">
                        <Link href="/privacy" className="hover:text-white transition-colors">{t('privacy')}</Link>
                        <Link href="/contact" className="hover:text-white transition-colors">Contact Us</Link>
                        <Link href="/terms" className="hover:text-white transition-colors">{t('terms')}</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}


