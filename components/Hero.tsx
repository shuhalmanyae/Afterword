"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Link } from "@/i18n/routing";
import { ArrowRight } from "lucide-react";
import { useTranslations } from 'next-intl';
import { useState, useEffect } from "react";

export default function Hero() {
    const t = useTranslations('Hero');
    const [index, setIndex] = useState(0);

    // Load carousel messages. We know there are 10.
    // We can't map reliably without keys if using t.raw(), but explicit keys are better.
    // However, t('carousel') returning an array works if configured, but strict types prefer:
    // constructing array manually or using raw. simplest is fixed length or iterating.
    // Let's assume standard array access via keys carousel.0, carousel.1 etc is safer for types?
    // No, valid JSON allows arrays. t.raw('carousel') works.

    // Actually, to be safe with type checking and next-intl, let's use a simple counter and t(`carousel.${index}`).
    // But we need to know the length. 10 items.
    const carouselLength = 10;

    useEffect(() => {
        const timer = setInterval(() => {
            setIndex((prev) => (prev + 1) % carouselLength);
        }, 5000); // 5 seconds per slide
        return () => clearInterval(timer);
    }, []);

    return (
        <div className="relative isolate flex-1 flex items-center overflow-hidden w-full">


            {/* Subtle "Soul" Glow (adjusted for left align) */}
            <div className="absolute top-1/2 left-0 -translate-y-1/2 w-[600px] h-[600px] bg-primary/20 blur-[150px] rounded-full opacity-30 pointer-events-none z-0" />

            <div className="mx-auto max-w-7xl px-6 lg:px-8 z-10 w-full">
                <div className="max-w-2xl text-left">
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                    >
                        <h1 className="text-5xl font-light tracking-tight text-foreground sm:text-7xl">
                            {t('title_part1')} <br />
                            <span className="font-semibold text-white drop-shadow-2xl">
                                {t('title_part2')}
                            </span>
                        </h1>
                    </motion.div>

                    <div className="mt-8 h-24 relative overflow-hidden max-w-xl">
                        <AnimatePresence mode="wait">
                            <motion.p
                                key={index}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                transition={{ duration: 1.5, ease: "easeInOut" }} // Sea wave tempo: slow, fluid
                                className="text-lg leading-8 text-muted-foreground font-light absolute top-0 left-0 w-full"
                            >
                                {t(`carousel.${index}`)}
                            </motion.p>
                        </AnimatePresence>
                    </div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 1, duration: 0.5 }}
                        className="mt-4 flex items-center justify-start gap-x-8"
                    >
                        <Link
                            href="#"
                            className="group relative rounded-full bg-transparent px-8 py-4 text-sm font-light text-white border border-white/30 hover:border-white/80 transition-all duration-500 flex items-center gap-3 overflow-hidden backdrop-blur-sm"
                        >
                            <div className="absolute inset-0 w-full h-full bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                            <span className="tracking-widest uppercase text-xs">{t('cta')}</span>
                            <ArrowRight className="w-4 h-4 text-white group-hover:translate-x-2 transition-transform duration-500" />
                        </Link>
                    </motion.div>
                </div>
            </div>
        </div>
    );
}
