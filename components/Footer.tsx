"use client";

import { useTranslations } from 'next-intl';

export default function Footer() {
    const t = useTranslations('Footer');

    return (
        <footer className="bg-background border-t border-border">
            <div className="mx-auto max-w-7xl px-6 py-12 md:flex md:items-center md:justify-between lg:px-8">
                <div className="flex justify-center md:order-2 space-x-6 md:space-x-8">
                    {/* Legal Links */}
                    <a
                        href="#"
                        className="text-sm text-gray-500 hover:text-foreground transition-colors"
                    >
                        {t('pledge')}
                    </a>
                    <a
                        href="#"
                        className="text-sm text-gray-500 hover:text-foreground transition-colors"
                    >
                        {t('privacy')}
                    </a>
                    <a
                        href="#"
                        className="text-sm text-gray-500 hover:text-foreground transition-colors"
                    >
                        {t('terms')}
                    </a>
                </div>
                <div className="mt-8 md:order-1 md:mt-0">
                    <p className="text-center text-xs leading-5 text-gray-500">
                        &copy; {new Date().getFullYear()} {t('copyright')}
                    </p>
                </div>
            </div>
        </footer>
    );
}
