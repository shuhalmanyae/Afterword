"use client";

import { motion } from "framer-motion";
import { Link } from "@/i18n/routing";
import { ArrowRight, ShieldCheck, Lock, Activity } from "lucide-react";
import Footer from "@/components/Footer";
import { useTranslations } from "next-intl";

export default function PledgePage() {
    const t = useTranslations("Pledge");

    return (
        <main className="min-h-screen bg-black text-white relative font-sans overflow-x-hidden">
            {/* Background Video (Reused) */}
            <video
                autoPlay
                muted
                loop
                playsInline
                className="fixed inset-0 w-full h-full object-cover z-0 opacity-40"
            >
                <source src="/videos/background.mp4" type="video/mp4" />
            </video>

            {/* Overlay */}
            <div className="fixed inset-0 bg-gradient-to-b from-black/80 via-black/60 to-black z-0" />

            {/* Content Container */}
            <div className="relative z-10 max-w-6xl mx-auto px-6 py-24 md:py-32 space-y-32">

                {/* Hero Section */}
                <motion.header
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1 }}
                    className="text-center space-y-6"
                >
                    <h1 className="text-5xl md:text-7xl font-light tracking-tight leading-tight">
                        {t('title')} <br />
                        <span className="text-white/40 italic text-3xl md:text-5xl block mt-4 font-serif">
                            {t('subtitle')}
                        </span>
                    </h1>
                </motion.header>

                {/* Core Section: The 3 Pillars */}
                <section className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <PledgeCard
                        title={t('Cards.mountain_title')}
                        header={t('Cards.mountain_header')}
                        body={t('Cards.mountain_body')}
                        footer={t('Cards.mountain_footer')}
                        icon={<ShieldCheck className="w-8 h-8 text-white/60 mb-4" />}
                        delay={0.2}
                    />
                    <PledgeCard
                        title={t('Cards.law_title')}
                        header={t('Cards.law_header')}
                        body={t('Cards.law_body')}
                        icon={<Lock className="w-8 h-8 text-white/60 mb-4" />}
                        delay={0.4}
                    />
                    <PledgeCard
                        title={t('Cards.guardian_title')}
                        header={t('Cards.guardian_header')}
                        body={t('Cards.guardian_body')}
                        icon={<Activity className="w-8 h-8 text-white/60 mb-4" />}
                        delay={0.6}
                    />
                </section>

                {/* Process Steps */}
                <section className="max-w-4xl mx-auto">
                    <div className="flex flex-col md:flex-row justify-between items-center gap-8 relative">
                        {/* Connecting Line (Desktop) */}
                        <div className="hidden md:block absolute top-1/2 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent -z-10" />

                        <ProcessStep number="01" label={t('Process.step1')} delay={0.8} />
                        <ProcessStep number="02" label={t('Process.step2')} delay={1.0} />
                        <ProcessStep number="03" label={t('Process.step3')} delay={1.2} />
                    </div>
                </section>

                {/* Footer / CTA */}
                <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    className="text-center py-20 border-t border-white/10 max-w-3xl mx-auto"
                >
                    <p className="text-xl md:text-2xl text-white/80 font-serif italic mb-10 leading-relaxed">
                        "{t('CTA.text')}"
                    </p>
                    <Link
                        href="/dashboard"
                        className="inline-flex items-center gap-3 px-10 py-5 bg-white text-black rounded-full font-bold tracking-widest text-sm hover:scale-105 transition-transform shadow-[0_0_40px_rgba(255,255,255,0.3)]"
                    >
                        {t('CTA.button')}
                        <ArrowRight className="w-4 h-4" />
                    </Link>
                </motion.div>

                {/* Global Footer */}
                <Footer />
            </div>
        </main>
    );
}

function PledgeCard({ title, header, body, footer, icon, delay }: { title: string, header: string, body: string, footer?: string, icon: React.ReactNode, delay: number }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay }}
            className="bg-white/5 backdrop-blur-md border border-white/10 p-8 rounded-2xl hover:bg-white/10 transition-colors flex flex-col h-full"
        >
            <div className="mb-4">{icon}</div>
            <h3 className="text-xs font-bold text-white/40 uppercase tracking-widest mb-4">{title}</h3>
            <h4 className="text-xl font-serif text-white mb-4 leading-tight">{header}</h4>
            <p className="text-white/60 text-sm leading-relaxed mb-6 flex-grow">{body}</p>
            {footer && (
                <p className="text-white/30 text-xs border-t border-white/10 pt-4 mt-auto">
                    {footer}
                </p>
            )}
        </motion.div>
    );
}

function ProcessStep({ number, label, delay }: { number: string, label: string, delay: number }) {
    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay }}
            className="flex flex-col items-center bg-black/40 backdrop-blur border border-white/10 p-6 rounded-full w-48 h-48 justify-center shadow-[0_0_30px_rgba(255,255,255,0.05)]"
        >
            <span className="text-4xl font-thin text-white/20 font-serif mb-2">{number}</span>
            <span className="text-white font-medium tracking-wide uppercase text-sm">{label}</span>
        </motion.div>
    );
}
