"use client";

import { Shield, Lock, Server } from "lucide-react";
import { useTranslations } from 'next-intl';

export default function TrustSignals() {
    const t = useTranslations('TrustSignals');

    const signals = [
        {
            icon: <Server className="h-6 w-6 text-primary" />,
            title: t('swiss_title'),
            description: t('swiss_desc'),
        },
        {
            icon: <Lock className="h-6 w-6 text-primary" />,
            title: t('encryption_title'),
            description: t('encryption_desc'),
        },
        {
            icon: <Shield className="h-6 w-6 text-primary" />,
            title: t('sovereignty_title'),
            description: t('sovereignty_desc'),
        },
    ];

    return (
        <div className="py-24 bg-black border-t border-white/5">
            <div className="max-w-6xl mx-auto px-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                    {signals.map((signal, index) => (
                        <div
                            key={index}
                            className="group flex flex-col items-center text-center p-8 rounded-3xl bg-white/5 border border-white/5 hover:border-primary/40 hover:bg-white/[0.07] transition-all duration-500"
                        >
                            <div className="mb-6 p-4 bg-black/50 rounded-full border border-white/10 group-hover:scale-110 group-hover:border-primary/50 transition-all duration-500 shadow-[0_0_15px_rgba(0,0,0,0.5)] group-hover:shadow-[0_0_20px_rgba(210,31,31,0.3)]">
                                {signal.icon}
                            </div>
                            <h3 className="text-lg font-medium text-white mb-3 tracking-wide">
                                {signal.title}
                            </h3>
                            <p className="text-sm text-muted-foreground leading-relaxed">
                                {signal.description}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
